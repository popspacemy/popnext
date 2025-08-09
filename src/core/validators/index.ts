import { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core"
import { isMobilePhone } from "validator"
import { z } from "zod/v4"

export function validateDateSchema() {
  return z.date()
}

export function validateIdSchema(isUuid = true) {
  return isUuid ? z.uuid() : z.string()
}

export function validateStringWithMinWords(val: string, minWords = 2) {
  const words = val.trim().split(/\s+/)
  return words.length >= minWords
}

export function validateEmailSchema() {
  return z.email()
}

export function validatePhoneNumberSchema() {
  return z.string().refine(isMobilePhone)
}

export function validateUrlSchema() {
  return z.url()
}

/**
 * DO NOT USE: It will cause typescript error
 */
// export const createTableValidationSchema = <T extends TableConfig>(
//   table: PgTableWithColumns<T>
// ) => {
//   const insertSchema = createInsertSchema(table)
//   const selectSchema = createSelectSchema(table)
//   const generateSchema = insertSchema
//   const updateSchema = insertSchema

//   return {
//     insertSchema,
//     selectSchema,
//     generateSchema,
//     updateSchema,
//   }
// }
