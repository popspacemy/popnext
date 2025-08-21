import { count, eq, getTableName, sql, SQL } from "drizzle-orm"
import {
  PgColumn,
  PgInsertValue,
  PgTable,
  PgTransaction,
  PgUpdateSetSource,
} from "drizzle-orm/pg-core"

import { ERROR } from "../constants/errors"
import { getLogger } from "../core/context-store"
import { db } from "../core/db"
import { handleServiceError } from "../server/error-handlers"
import { ServiceError } from "../types/errors"
import { GetAllDataResult, GetDataResult, SaveDataResult, Transaction } from "../types/services"
import { formatError } from "../utils/errors"

interface TableWithId {
  id: PgColumn<any>
}

interface SelectRecordsParams<T extends PgTable, TableColumns> {
  page: number
  table: T
  selectColumns?: Record<keyof TableColumns, any>
  filterCondition?: SQL<unknown>
  orderCondition: SQL<unknown>
  limit?: number
  tx?: Transaction
}

interface SelectRecordByIdParams<T extends PgTable & TableWithId> {
  table: T
  id: string
  filterCondition?: SQL<unknown>
  tx?: Transaction
}

interface InsertRecordParams<T extends PgTable & TableWithId> {
  table: T
  newRecord: PgInsertValue<T>
  tx?: Transaction
}

interface UpdateRecordParams<T extends PgTable & TableWithId> {
  table: T
  id?: string
  updatedRecord: PgUpdateSetSource<T>
  filterCondition?: SQL<unknown>
  tx?: Transaction
}

interface DeleteRecordParams<T extends PgTable & TableWithId> {
  table: T
  id?: string
  filterCondition?: SQL<unknown>
  tx?: Transaction
}

export async function withTransaction<T>(
  callback: (tx: Transaction) => Promise<T>
): Promise<T | ServiceError> {
  const logger = getLogger()
  logger.setContext({ operation: "withTransaction" })

  try {
    const result = await db.transaction(async (tx) => {
      return await callback(tx)
    })

    return result
  } catch (error) {
    return handleServiceError(formatError(error, ERROR.INTERNAL.DB_ERROR))
  }
}

export const getRecordCount = async <T extends PgTable>(
  table: T,
  condition?: SQL<unknown>,
  tx?: Transaction
): Promise<number> => {
  const executor = tx || db
  const [result] = await executor
    .select({ count: count() })
    .from(table as any)
    .where(condition)
  return result.count
}

export const selectRecords = async <T extends PgTable, TableColumns>({
  page,
  table,
  selectColumns,
  filterCondition,
  orderCondition,
  limit,
  tx,
}: SelectRecordsParams<T, TableColumns>): Promise<GetAllDataResult<TableColumns>> => {
  const logger = getLogger()
  logger.setContext({ operation: "selectRecords" })

  const baseResult = { success: true, data: [], totalRecords: 0 }

  if (page < 1) {
    return {
      ...baseResult,
      ...handleServiceError(
        formatError("Page number must be greater than 0", ERROR.RESOURCE.NOT_ALLOWED),
        { params: { page } }
      ),
    }
  }

  const executor = tx || db
  let query

  try {
    const totalRecords = await getRecordCount(table, filterCondition, tx)
    const limitValue = limit || 10
    const maxPage = Math.ceil(totalRecords / limitValue)

    if (maxPage === 0) {
      return baseResult
    }

    if (page > maxPage) {
      return {
        ...baseResult,
        ...handleServiceError(
          formatError("Page number is out of range", ERROR.RESOURCE.NOT_ALLOWED),
          { params: { page, maxPage } }
        ),
      }
    }

    const selectStatement = selectColumns ? executor.select(selectColumns) : executor.select()
    query = selectStatement
      .from(table as any)
      .where(filterCondition)
      .limit(limitValue)
      .offset((page - 1) * limitValue)
      .orderBy(orderCondition)
    const rows = await query

    return { success: true, data: rows as TableColumns[], totalRecords }
  } catch (error) {
    return {
      ...baseResult,
      ...handleServiceError(formatError(error, ERROR.INTERNAL.DB_ERROR), {
        params: { page, table: getTableName(table), query: query?.toSQL() },
      }),
    }
  }
}

export const selectRecordById = async <T extends PgTable & TableWithId, R = any>({
  table,
  id,
  filterCondition,
  tx,
}: SelectRecordByIdParams<T>): Promise<GetDataResult<R>> => {
  const logger = getLogger()
  logger.setContext({ operation: "selectRecordById" })

  const baseResult = { success: true, data: null }
  const executor = tx || db

  let query

  try {
    const condition = filterCondition ? filterCondition : eq(table.id, id)
    query = executor
      .select()
      .from(table as any)
      .where(condition)
    const [row] = (await query) as R[]
    return row ? { success: true, data: row } : baseResult
  } catch (error) {
    return {
      ...baseResult,
      ...handleServiceError(formatError(error, ERROR.INTERNAL.DB_ERROR), {
        params: { id, table: getTableName(table), query: query?.toSQL() },
      }),
    }
  }
}

export const insertRecord = async <T extends PgTable & TableWithId>({
  table,
  newRecord,
  tx,
}: InsertRecordParams<T>): Promise<SaveDataResult<{ id: string }>> => {
  const logger = getLogger()
  logger.setContext({ operation: "insertRecord" })

  const baseResult = { data: null }
  const executor = tx || db

  let query

  try {
    query = executor.insert(table).values(newRecord).returning({ id: table.id })
    const [result] = await query
    return { success: true, data: result }
  } catch (error) {
    return {
      ...baseResult,
      ...handleServiceError(formatError(error, ERROR.INTERNAL.DB_ERROR), {
        params: { newRecord, table: getTableName(table), query: query?.toSQL() },
      }),
    }
  }
}

export const updateRecord = async <T extends PgTable & TableWithId>({
  table,
  id,
  updatedRecord,
  filterCondition,
  tx,
}: UpdateRecordParams<T>): Promise<SaveDataResult<{ id: string }>> => {
  const logger = getLogger()
  logger.setContext({ operation: "updateRecord" })

  const baseResult = { data: null }
  const executor = tx || db

  let query

  try {
    const condition = filterCondition ? filterCondition : eq(table.id, id)
    query = executor.update(table).set(updatedRecord).where(condition).returning({ id: table.id })
    const [result] = await query
    return { success: true, data: result }
  } catch (error) {
    return {
      ...baseResult,
      ...handleServiceError(formatError(error, ERROR.INTERNAL.DB_ERROR), {
        params: { updatedRecord, table: getTableName(table), query: query?.toSQL() },
      }),
    }
  }
}

export const deleteRecord = async <T extends PgTable & TableWithId>({
  table,
  id,
  filterCondition,
  tx,
}: DeleteRecordParams<T>): Promise<SaveDataResult<{ id: string }>> => {
  const logger = getLogger()
  logger.setContext({ operation: "deleteRecord" })

  const baseResult = { data: null }
  const executor = tx || db

  let query

  try {
    const condition = filterCondition ? filterCondition : eq(table.id, id)
    query = executor.delete(table).where(condition).returning({ id: table.id })
    const [result] = await query
    return { success: true, data: result }
  } catch (error) {
    return {
      ...baseResult,
      ...handleServiceError(formatError(error, ERROR.INTERNAL.DB_ERROR), {
        params: { id, table: getTableName(table), query: query?.toSQL() },
      }),
    }
  }
}

export const executeQuery = async ({
  query,
  tx,
}: {
  query: string
  tx?: Transaction
}): Promise<unknown> => {
  const logger = getLogger()
  logger.setContext({ operation: "executeQuery" })

  const executor = tx || db

  try {
    const result = await executor.execute(sql.raw(`${query}`))
    return { success: true, data: result }
  } catch (error) {
    return handleServiceError(formatError(error, ERROR.INTERNAL.DB_ERROR), {
      params: { query },
    })
  }
}

// todo: create a wrapper for selectRecordWithFilter for filter other than id
// todo: create a wrapper for selectRecordWithJoin
