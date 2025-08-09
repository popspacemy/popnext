import { runWithLogger } from "../../core/context-store"
import { createRequestLogger } from "../../core/logger"
import { BaseRequestContext } from "../../types/request-handlers"

export const withLogger = async <T extends BaseRequestContext>(
  context: T,
  next: (ctx: T) => Promise<any>
) => {
  const correlationId = context.correlationId || crypto.randomUUID()
  const tags = context.tags || []

  const logger = createRequestLogger({ correlationId, tags })

  // Create the context with logger
  const contextWithLogger = {
    ...context,
    logger,
    correlationId,
  } as T

  // logger.info("Request started");

  try {
    // Run the next middleware with the logger stored in AsyncLocalStorage
    return await runWithLogger(logger, () => next(contextWithLogger))
  } catch (error) {
    // Log error if needed
    // logger.error("Request failed", error);
    throw error
  }
}
