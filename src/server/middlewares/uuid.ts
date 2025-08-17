import { ERROR } from "../../constants/errors"
import { getLogger } from "../../core/context-store"
import { Middleware } from "../../types/request-handlers"
import { toLongUuid } from "../../utils/common"
import { formatError } from "../../utils/errors"
import { handleServiceError } from "../error-handlers"

type Input = {
  params: {
    id: string
  }
}

type Output = {}

export const withLongId: Middleware<Input, Output> = async (context, next) => {
  const logger = getLogger()
  logger.setContext({ operation: "withLongId" })

  try {
    const longId = toLongUuid(context?.params?.id)

    return next({
      ...context,
      params: {
        ...context.params,
        id: longId,
      },
    })
  } catch (error) {
    return handleServiceError(formatError(error, ERROR.RESOURCE.NOT_FOUND), {
      params: context.params,
    })
  }
}
