import { ZodError } from "zod/v4"

import { ERROR, ErrorDefinition } from "../constants/errors"
import type { ErrorDetails } from "../types/errors"

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
