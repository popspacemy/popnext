import { AsyncLocalStorage } from "async_hooks"

import { CustomLogger } from "../logger"

// Create AsyncLocalStorage instance to store just the logger
export const loggerStore = new AsyncLocalStorage<CustomLogger>()

/**
 * Get the current logger from AsyncLocalStorage
 * @returns The current logger or throws an error if not available
 */
export function getLogger(): CustomLogger {
  const logger = loggerStore.getStore()
  if (!logger) {
    throw new Error(
      "Logger not available in current context. Make sure you are within a request context."
    )
  }
  return logger
}

/**
 * Run a function with the provided logger
 * @param logger The logger to use
 * @param fn The function to run with the logger
 * @returns The result of the function
 */
export function runWithLogger<T>(logger: CustomLogger, fn: () => T): T {
  return loggerStore.run(logger, fn)
}
