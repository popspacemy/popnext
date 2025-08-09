# Request Handler Documentation

## Overview

The `handleRequest` function is a powerful utility that implements a middleware pattern similar to Express.js for handling requests in a structured and composable way. It allows you to create a chain of middleware functions that process a request context sequentially before executing a final service handler.

## Key Features

- **Middleware Chain**: Execute a series of middleware functions in sequence
- **Context Transformation**: Each middleware can modify the context before passing it to the next one
- **Type Safety**: Fully typed with TypeScript generics for better developer experience
- **Error Handling**: Built-in error middleware that catches and processes errors
- **Logging**: Automatic request logging through the logger middleware

## Import

```typescript
import { handleRequest } from "@/server"
```

## API Reference

### `handleRequest<TServiceContext, THandler>(config)`

```typescript
function handleRequest<
  TServiceContext = RequestContext,
  THandler extends ServiceHandler<TServiceContext> = ServiceHandler<TServiceContext>,
>({
  context,
  middlewares,
  serviceHandler,
}: RequestHandlerConfig<InitialRequestContext, TServiceContext> & {
  serviceHandler: THandler
}): Promise<Awaited<ReturnType<THandler>>>
```

#### Parameters

- **config**: Configuration object with the following properties:
  - **context**: `InitialRequestContext` - The initial context object for the request
  - **middlewares**: `Middleware[]` - Array of middleware functions to execute
  - **serviceHandler**: `ServiceHandler<TServiceContext>` - The final handler function

#### Returns

- `Promise<Awaited<ReturnType<THandler>>>` - The result of the service handler execution

## Usage Examples

### Basic Example

```typescript
const handleGetData = async (id: string) => {
  const context: InitialRequestContext = {
    correlationId: crypto.randomUUID(),
    params: { id },
  }

  const middlewares = [withAuth]

  const serviceHandler = async (ctx: ServiceHandlerContext) => {
    return fetchDataById(ctx.user, id)
  }

  return handleRequest({
    context,
    middlewares,
    serviceHandler,
  })
}
```

### Example with Data Validation

```typescript
const handleCreateItem = async (item: Item) => {
  const context: InitialRequestContext = {
    correlationId: crypto.randomUUID(),
    data: item,
  }

  const middlewares = [withAuth, withDataValidation(itemSchema)]

  const serviceHandler = async (ctx: ServiceHandlerContext<Item>) => {
    // ctx.validatedData contains the validated item
    return createItem(ctx.user, ctx.validatedData)
  }

  return handleRequest({
    context,
    middlewares,
    serviceHandler,
  })
}
```

### Example with Query Parameters

```typescript
const handleListItems = async (page: number, limit: number) => {
  const context: InitialRequestContext = {
    correlationId: crypto.randomUUID(),
    query: { page, limit },
  }

  const middlewares = [withAuth, withPagination]

  const serviceHandler = async (ctx: ServiceHandlerContext) => {
    // ctx.validatedQuery contains the validated and processed query params
    return listItems(ctx.user, ctx.validatedQuery.page, ctx.validatedQuery.limit)
  }

  return handleRequest({
    context,
    middlewares,
    serviceHandler,
  })
}
```

## Creating Custom Middleware

You can create custom middleware functions to extend the functionality:

```typescript
export const withCustomLogic: Middleware = async (context, next) => {
  // Do something with the context before the next middleware
  console.log("Processing request:", context.correlationId)

  // You can modify the context
  const enhancedContext = {
    ...context,
    customData: "some value",
  }

  // Call the next middleware with the modified context
  const result = await next(enhancedContext)

  // You can also modify the result before returning it
  return {
    ...result,
    processedAt: new Date(),
  }
}
```

## Built-in Middlewares

### withLogger

Automatically added to all requests. Sets up logging context and tracks request execution.

### withError

Automatically added as the last middleware. Catches any errors thrown during the middleware chain or service handler execution.

### withAuth

Verifies user authentication and adds the user object to the context.

```typescript
// Example usage
const middlewares = [withAuth]
```

### withDataValidation

Validates request data against a schema and adds the validated data to the context.

```typescript
// Example usage
const middlewares = [withDataValidation(mySchema)]
```
