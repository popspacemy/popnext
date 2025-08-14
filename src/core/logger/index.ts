import pino, { Logger } from "pino"
import { uuid } from "short-uuid"

import { ErrorSource, RequestSource } from "../../constants/operations"
import { ErrorDetails } from "../../types/errors"

export interface AdditionalDetails {
  errorSource?: ErrorSource
  message?: string
  [key: string]: unknown
}

export interface Context {
  correlationId?: string
  userId?: string
  requestHandler?: string
  requestSource?: RequestSource
  operation?: string
  [key: string]: unknown
}

const commonConfig = {
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() }
    },
  },
  env: { env: process.env.NODE_ENV },
}

const baseLogger: Logger =
  process.env["NODE_ENV"] === "production"
    ? // JSON in production
      pino({ ...commonConfig, level: "warn" })
    : // Pretty print in development
      pino({
        ...commonConfig,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      })

const logEvent = (
  logger = baseLogger,
  eventName: string,
  data: Record<string, unknown>,
  details?: AdditionalDetails
) => {
  logger.info({ event: eventName, ...data, details })
}

const logError = (
  logger = baseLogger,
  message: string,
  error: ErrorDetails,
  details?: AdditionalDetails
) => {
  logger.error({
    message,
    status: error.status,
    error: {
      name: error.name ?? "Unknown error",
      message: error.message ?? "Unknown error",
      // stack: error.stack, // TODO: enable this when needed
      code: error.code,
    },
    details,
  })
}

export const createLogger = (context: Context) => {
  const logger = baseLogger.child({ context })
  return {
    setBindings: (bindings: Record<string, unknown>) => {
      const currentBindings = logger.bindings()
      const mergedBindings = {
        ...currentBindings,
        ...bindings,
        context: bindings.context
          ? { ...currentBindings.context, ...bindings.context }
          : currentBindings.context,
      }
      return logger.setBindings(mergedBindings)
    },
    setContext: (context: Context) => {
      const currentBindings = logger.bindings()
      const mergedContext = { ...currentBindings.context, ...context }
      return logger.setBindings({ context: mergedContext })
    },
    info: (eventName: string, data: Record<string, unknown>, details?: AdditionalDetails) =>
      logEvent(logger, eventName, data, details),
    error: (message: string, error: ErrorDetails, details?: AdditionalDetails) =>
      logError(logger, message, error, details),
  }
}

export const createRequestLogger = (context: Context) =>
  createLogger({ ...context, correlationId: context.correlationId ?? uuid() })

export type CustomLogger = ReturnType<typeof createLogger>

export default baseLogger
