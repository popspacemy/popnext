import { count, eq, getTableName, sql, SQL } from "drizzle-orm"
import { PgColumn, PgInsertValue, PgTable, PgUpdateSetSource, PgTransaction } from "drizzle-orm/pg-core"

import { ERROR } from "../constants/errors"
import { getLogger } from "../core/context-store"
import { db } from "../core/db"
import { handleServiceError } from "../server/error-handlers"
import { GetAllDataResult, GetDataResult, SaveDataResult } from "../types/services"
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
}

interface SelectRecordByIdParams<T extends PgTable & TableWithId> {
  table: T
  id: string
  filterCondition?: SQL<unknown>
}

interface InsertRecordParams<T extends PgTable & TableWithId> {
  table: T
  newRecord: PgInsertValue<T>
}

interface UpdateRecordParams<T extends PgTable & TableWithId> {
  table: T
  id?: string
  updatedRecord: PgUpdateSetSource<T>
  filterCondition?: SQL<unknown>
}

interface DeleteRecordParams<T extends PgTable & TableWithId> {
  table: T
  id?: string
  filterCondition?: SQL<unknown>
}

// Transaction-related types
type TransactionOperation<T = any> = (tx: PgTransaction<any, any, any>) => Promise<T>

interface TransactionResult<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

export const getRecordCount = async <T extends PgTable>(
  table: T,
  condition?: SQL<unknown>
): Promise<number> => {
  const [result] = await db
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

  let query

  try {
    const totalRecords = await getRecordCount(table, filterCondition)
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

    const selectStatement = selectColumns ? db.select(selectColumns) : db.select()
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
}: SelectRecordByIdParams<T>): Promise<GetDataResult<R>> => {
  const logger = getLogger()
  logger.setContext({ operation: "selectRecordById" })

  const baseResult = { success: true, data: null }

  let query

  try {
    const condition = filterCondition ? filterCondition : eq(table.id, id)
    query = db
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
}: InsertRecordParams<T>): Promise<SaveDataResult<{ id: string }>> => {
  const logger = getLogger()
  logger.setContext({ operation: "insertRecord" })

  const baseResult = { data: null }

  let query

  try {
    query = db.insert(table).values(newRecord).returning({ id: table.id })
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
}: UpdateRecordParams<T>): Promise<SaveDataResult<{ id: string }>> => {
  const logger = getLogger()
  logger.setContext({ operation: "updateRecord" })

  const baseResult = { data: null }

  let query

  try {
    const condition = filterCondition ? filterCondition : eq(table.id, id)
    query = db.update(table).set(updatedRecord).where(condition).returning({ id: table.id })
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
}: DeleteRecordParams<T>): Promise<SaveDataResult<{ id: string }>> => {
  const logger = getLogger()
  logger.setContext({ operation: "deleteRecord" })

  const baseResult = { data: null }

  let query

  try {
    const condition = filterCondition ? filterCondition : eq(table.id, id)
    query = db.delete(table).where(condition).returning({ id: table.id })
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

export const executeQuery = async ({ query }: { query: string }): Promise<unknown> => {
  const logger = getLogger()
  logger.setContext({ operation: "executeQuery" })

  try {
    const result = await db.execute(sql.raw(`${query}`))
    return { success: true, data: result }
  } catch (error) {
    return handleServiceError(formatError(error, ERROR.INTERNAL.DB_ERROR), {
      params: { query },
    })
  }
}

// Transaction utilities - expose the raw transaction for maximum flexibility
export const transaction = db.transaction

// todo: create a wrapper for selectRecordWithFilter for filter other than id
// todo: create a wrapper for selectRecordWithJoin
