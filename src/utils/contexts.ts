import type { NextRequest } from "next/server"

import { ErrorContext } from "../constants/errors"
import { Context } from "../types/loggers"
import { HttpMethod } from "../types/requests"

export function formatErrorContext({
  request,
  params,
  payload,
}: {
  request: NextRequest
  params?: Record<string, unknown>
  payload?: Record<string, unknown>
}): ErrorContext {
  return {
    requestQuery: Object.fromEntries(request.nextUrl.searchParams),
    requestBody: payload,
    requestParams: params,
  }
}

export function formatInitialApiContext(endpoint: string, method: HttpMethod): Partial<Context> {
  return {
    correlationId: crypto.randomUUID(),
    requestSource: "api",
    endpoint,
    method,
  }
}

export function formatInitialActionContext(): Partial<Context> {
  return {
    correlationId: crypto.randomUUID(),
    requestSource: "server-action",
  }
}
