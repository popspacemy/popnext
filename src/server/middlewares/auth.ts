import { headers } from "next/headers"

import { ERROR } from "../../constants/errors"
import { auth } from "../../core/auth"
import { getLogger } from "../../core/context-store"
import { AuthUser } from "../../types/auth"
import { Middleware } from "../../types/request-handlers"
import { formatError, handleServiceError } from "../error-handlers"

type Input = {}

type Output = {
  user: AuthUser
}

/**
 * Authentication middleware that verifies the user is authenticated
 * and adds the user to the context
 */
export const withAuth: Middleware<Input, Output> = async (context, next) => {
  const logger = getLogger()
  logger.setContext({ operation: "withAuth" })

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // User is not logged in
    if (!session) {
      return handleServiceError(formatError("getSession returned null", ERROR.AUTH.UNAUTHENTICATED))
    }

    logger.setContext({ userId: session.user.id })

    return next({
      ...context,
      user: session.user,
    })
  } catch (error) {
    return handleServiceError(formatError(error, ERROR.INTERNAL.UNEXPECTED))
  }
}
