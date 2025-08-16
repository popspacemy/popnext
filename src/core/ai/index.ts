import { generateObject as _generateObject, streamObject as _streamObject } from "ai"

import type { BaseAIParams, StreamParams } from "../../types"

/**
 * Stream AI response as partial object while they are being generated
 */
export const streamObject = async <T>(params: StreamParams<T>) => {
  return _streamObject({
    ...params,
    onFinish: async ({ object, error, usage }) => {
      if (params.onFinish) {
        await params.onFinish({ result: object as T, error, usage })
      }
    },
    onError: async (error) => {
      if (params.onError) {
        await params.onError(error)
      }
    },
  })
}

/**
 * Generate AI response as a complete object
 */
export const generateObject = <T>(params: BaseAIParams<T>) => {
  return _generateObject(params)
}
