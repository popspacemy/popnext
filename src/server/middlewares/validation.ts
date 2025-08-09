import z, { ZodType } from "zod/v4"

import { ERROR } from "../../constants/errors"
import { getLogger } from "../../core/context-store"
import { Middleware } from "../../types/request-handlers"
import { AnyObject, UnknownObject } from "../../types/utils"
import { formatError, handleServiceError } from "../error-handlers"

type WithValidatedDataInput<T = AnyObject> = {
  data: T
}
type WithValidatedDataOutput<T = AnyObject> = {
  validatedData: T
}

type WithValidatedQueryInput<T = AnyObject> = {
  query: T
}
type WithValidatedQueryOutput<T = AnyObject> = {
  validatedQuery: T
}

type WithValidatedParamsInput<T = AnyObject> = {
  params: T
}
type WithValidatedParamsOutput<T = AnyObject> = {
  validatedParams: T
}

/**
 * Type-safe data validation middleware that adds validated data to the context
 * @param schema Zod schema for validating the data
 * @returns A middleware that validates the data and adds the validated data to the context
 */
export const withValidatedData = <T>(
  schema: ZodType<T>
): Middleware<WithValidatedDataInput<T>, WithValidatedDataOutput<T>> => {
  return async (context, next) => {
    const logger = getLogger()
    logger.setContext({ operation: "withValidatedData" })

    const validationResult = schema.safeParse(context.data)

    if (!validationResult.success) {
      return handleServiceError(
        formatError(z.prettifyError(validationResult.error), ERROR.VALIDATION.SCHEMA_VALIDATION),
        { requestData: context.data as UnknownObject }
      )
    }

    return next({
      ...context,
      validatedData: validationResult.data,
    })
  }
}

/**
 * Type-safe query validation middleware that adds validated query to the context
 * @param schema Zod schema for validating the query
 * @returns A middleware that validates the query and adds the validated query to the context
 */
export const withValidatedQuery = <T>(
  schema: ZodType<T>
): Middleware<WithValidatedQueryInput<T>, WithValidatedQueryOutput<T>> => {
  return async (context, next) => {
    const logger = getLogger()
    logger.setContext({ operation: "withValidatedQuery" })

    const validationResult = schema.safeParse(context.query)

    if (!validationResult.success) {
      return handleServiceError(
        formatError(z.prettifyError(validationResult.error), ERROR.VALIDATION.SCHEMA_VALIDATION),
        { requestQuery: context.query as UnknownObject }
      )
    }

    return next({
      ...context,
      validatedQuery: validationResult.data,
    })
  }
}

/**
 * Type-safe param validation middleware that adds validated params to the context
 * @param schema Zod schema for validating the params
 * @returns A middleware that validates the params and adds the validated params to the context
 */
export const withValidatedParams = <T>(
  schema: ZodType<T>
): Middleware<WithValidatedParamsInput<T>, WithValidatedParamsOutput<T>> => {
  return async (context, next) => {
    const logger = getLogger()
    logger.setContext({ operation: "withValidatedParams" })

    const validationResult = schema.safeParse(context.params)

    if (!validationResult.success) {
      return handleServiceError(
        formatError(z.prettifyError(validationResult.error), ERROR.VALIDATION.SCHEMA_VALIDATION),
        { requestParams: context.params as UnknownObject }
      )
    }

    return next({
      ...context,
      validatedParams: validationResult.data,
    })
  }
}
