import { BaseRequestContext, Middleware, RequestContext } from "../types/request-handlers"
import { withError } from "./middlewares/error"
import { withLogger } from "./middlewares/logger"

/**
 * Type for service handler functions that process the final context
 */
export type ServiceHandler<TContext = any> = (context: TContext) => Promise<any>

/**
 * Type for request handler configuration
 */
export interface RequestHandlerConfig<TServiceContext = any> {
  context: BaseRequestContext
  middlewares: readonly Middleware[]
  serviceHandler: ServiceHandler<TServiceContext>
}

/**
 * Creates a base handler that processes a chain of middleware
 * @param initialCtx The initial context to pass to the middleware chain
 * @param middlewares Array of middleware functions to execute sequentially
 * @param handler The final handler function to execute after all middleware
 */
export async function createHandler<TInput, TOutput>(
  initialCtx: TInput,
  middlewares: Middleware[],
  handler: ServiceHandler<TOutput>
): Promise<any> {
  let index = 0

  const executeMiddleware = async (currentCtx: any): Promise<any> => {
    if (index === middlewares.length) {
      return handler(currentCtx)
    }

    const middleware = middlewares[index++]
    return middleware(currentCtx, (modifiedCtx: any) => executeMiddleware(modifiedCtx))
  }

  try {
    return await executeMiddleware(initialCtx)
  } catch (error) {
    console.error("Middleware chain error:", error)
    throw error
  }
}

/**
 * Handles a request by applying middleware and executing a service handler
 * This function imitates Express.js route handler pattern, allowing context to be
 * passed and processed sequentially through middleware
 * @param config Configuration object containing context, middlewares, and service handler
 */
export async function handleRequest<
  TServiceContext = RequestContext,
  THandler extends ServiceHandler<TServiceContext> = ServiceHandler<TServiceContext>,
>({
  context,
  middlewares,
  serviceHandler,
}: RequestHandlerConfig<TServiceContext> & {
  serviceHandler: THandler
}): Promise<Awaited<ReturnType<THandler>>> {
  const requestMiddlewares = [withLogger, ...middlewares, withError]

  // 1. Apply withLogger first to complete the context
  // 2. Apply user-provided middlewares
  // 3. Apply withError last to catch any errors
  return createHandler(context, requestMiddlewares, serviceHandler) as Promise<
    Awaited<ReturnType<THandler>>
  >
}
