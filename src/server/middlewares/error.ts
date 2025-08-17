import { ERROR } from "../../constants/errors"
import { getLogger } from "../../core/context-store"
import { ServiceHandlerContext } from "../../types/request-handlers"
import { formatError } from "../../utils/errors"
import { handleServiceError } from "../error-handlers"

/**
 * Error handling middleware that catches any uncaught errors in the request chain.
 *
 * How the middleware chain works:
 * 1. Middlewares are called in sequence: [withLogger, ...userMiddlewares, withError]
 * 2. Each middleware must call and await its 'next' function before returning
 * 3. This creates a nested structure like:
 *    withLogger(ctx, async ctx1 => {
 *      await withAuth(ctx1, async ctx2 => {
 *        await withError(ctx2, async ctx3 => {
 *          return handler(ctx3) // <-- If this throws
 *        }) // <-- Error is caught here
 *      })
 *    })
 *
 * Even though withError is called before the handler, its try-catch wraps the handler's
 * execution because of this nested async chain. The error bubbles up through the async
 * calls until it hits this try-catch block.
 */
export const withError = async <T extends ServiceHandlerContext, R>(
  context: T,
  next: (ctx: T) => Promise<R>
) => {
  const logger = getLogger()
  logger.setContext({ operation: "withError" })

  try {
    return await next(context)
  } catch (error) {
    return handleServiceError(formatError(error, ERROR.INTERNAL.UNHANDLED))
  }
}
