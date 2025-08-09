import { notFound } from "next/navigation"

import { ERROR } from "../../constants/errors"
import { ErrorResponse } from "../../types/errors"

export function handleError(error: ErrorResponse) {
  if (error.code === ERROR.AUTH.UNAUTHENTICATED.code) {
    return <div>{ERROR.AUTH.UNAUTHENTICATED.message}</div>
  }

  if (error.code === ERROR.AUTH.UNAUTHORIZED.code) {
    return <div>{ERROR.AUTH.UNAUTHORIZED.message}</div>
  }

  if (error.code === ERROR.RESOURCE.NOT_ALLOWED.code) {
    return notFound()
  }

  if (error.code === ERROR.INTERNAL.DB_ERROR.code) {
    return <div>{ERROR.INTERNAL.DB_ERROR.message}</div>
  }

  if (error.code === ERROR.INTERNAL.UNEXPECTED.code) {
    return <div>{ERROR.INTERNAL.UNEXPECTED.message}</div>
  }

  return <div>Error</div>
}
