import { NextResponse } from "next/server"
import { ZodError } from "zod/v4"

import { ERROR, ErrorContext, ErrorDefinition } from "../constants/errors"
import { getLogger } from "../core/context-store"
import { ErrorDetails, ServiceError } from "../types/errors"

export function formatError(error: unknown, errorDef?: ErrorDefinition): ErrorDetails {
  const defaultError = ERROR.INTERNAL.UNEXPECTED

  if (typeof error === "string") {
    return {
      name: errorDef?.name ?? defaultError.name,
      code: errorDef?.code ?? defaultError.code,
      message: error,
      publicMessage: errorDef?.message ?? defaultError.message,
      status: errorDef?.status ?? defaultError.status,
    }
  }

  if (error instanceof ZodError) {
    return {
      name: errorDef?.name ?? ERROR.VALIDATION.SCHEMA_VALIDATION.name,
      code: errorDef?.code ?? ERROR.VALIDATION.SCHEMA_VALIDATION.code,
      message: JSON.parse(error.message),
      publicMessage: ERROR.VALIDATION.SCHEMA_VALIDATION.message,
      // stack: error.errors,
      status: errorDef?.status ?? ERROR.VALIDATION.SCHEMA_VALIDATION.status,
    }
  }

  if (error instanceof Error) {
    return {
      name: errorDef?.name ?? defaultError.name,
      code: errorDef?.code ?? defaultError.code,
      message: error.message,
      stack: error.stack,
      publicMessage: errorDef?.message ?? defaultError.message,
      status: errorDef?.status ?? defaultError.status,
    }
  }

  return {
    name: errorDef?.name ?? defaultError.name,
    code: errorDef?.code ?? defaultError.code,
    message: String(error),
    publicMessage: errorDef?.message ?? defaultError.message,
    stack: undefined,
    status: errorDef?.status ?? defaultError.status,
  }
}

export function handleServiceError(error: ErrorDetails, context: ErrorContext = {}): ServiceError {
  const logger = getLogger()
  logger.error(error.publicMessage, error, {
    params: context.params,
    requestParams: context.requestParams,
    requestQuery: context.requestQuery,
    requestData: context.requestData,
    ...context.additionalContext,
  })

  return {
    success: false,
    error: {
      code: error.code,
      message: error.publicMessage,
      status: error.status,
    },
  }
}

export function handleApiError(error: ErrorDetails, context: ErrorContext): NextResponse {
  const logger = getLogger()
  logger.error(error.publicMessage, error, {
    status: error.status,
    params: context.params,
    requestParams: context.requestParams,
    requestQuery: context.requestQuery,
    requestBody: context.requestBody,
    ...context.additionalContext,
  })

  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        status: error.status,
      },
      details: error.issues,
    })
  }

  return NextResponse.json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      status: error.status,
    },
  })
}
