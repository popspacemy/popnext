import { ERROR } from "../constants"
import { generateObject, streamObject } from "../core/ai"
import { formatError, handleServiceError } from "../server/error-handlers"
import { BaseAIParams, GetGenerationResult, StreamGenerationResult, StreamParams } from "../types"

export const streamAiGeneration = async <T>(
  params: StreamParams<T>
): Promise<StreamGenerationResult> => {
  try {
    return {
      success: null,
      isStreaming: true,
      data: await streamObject<T>(params),
    }
  } catch (error) {
    return {
      data: null,
      isStreaming: false,
      ...handleServiceError(formatError(error, ERROR.AI.GENERATION_FAILED), {
        params: params as unknown as Record<string, unknown>,
      }),
    }
  }
}

export const getAiGeneration = async <T>(
  params: BaseAIParams<T>
): Promise<GetGenerationResult<T>> => {
  try {
    const { object } = await generateObject(params)
    return {
      success: true,
      data: object as T,
    }
  } catch (error) {
    return {
      data: null,
      ...handleServiceError(formatError(error, ERROR.AI.GENERATION_FAILED), {
        params: params as unknown as Record<string, unknown>,
      }),
    }
  }
}
