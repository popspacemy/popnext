import { ERROR, ErrorContext } from "../constants/errors"
import { getLogger } from "../core/context-store"
import { createRequestLogger } from "../core/logger"
import type { ApiError, ErrorDetails, ErrorResponse, ServiceError } from "../types/errors"
import { Context } from "../types/loggers"

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

export function handleApiError(error: ErrorResponse | null | undefined): ApiError {
  if (error) {
    return {
      success: false,
      error,
      // details: {}
    }
  }

  const errorDef = ERROR.INTERNAL.UNHANDLED
  return {
    success: false,
    error: {
      code: errorDef.code,
      message: errorDef.message,
      status: errorDef.status,
    },
    // details: "Unknown"
  }
}

export function handleApiException(
  error: unknown,
  requestContext: Context,
  errorContext: ErrorContext
): ApiError {
  const errorDef = ERROR.INTERNAL.UNEXPECTED
  const errorDetails = {
    name: errorDef.name,
    code: errorDef.code,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    publicMessage: errorDef.message,
    status: errorDef.status,
  }

  // handleApiException is called outside of the request handler lifecycle, hence, it will not have the access
  // to the request logger within async-local-storage. We will have to create a new logger instance here.
  const logger = createRequestLogger(requestContext)
  logger.error(errorDef.message, errorDetails, {
    requestParams: errorContext.requestParams,
    requestQuery: errorContext.requestQuery,
    requestBody: errorContext.requestBody,
  })

  return {
    success: false,
    error: {
      code: errorDef.code,
      message: errorDef.message,
      status: errorDef.status,
    },
  }
}
