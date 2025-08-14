import { generateObject, streamObject, type LanguageModel, type LanguageModelUsage } from "ai"
import { ZodType } from "zod/v4"

interface BaseAIParams<T> {
  system: string
  prompt: string
  schema: ZodType
  mode: "json" | "auto" | "tool"
  model: LanguageModel
  temperature: number
  maxTokens: number
}

interface StreamParams<T> extends BaseAIParams<T> {
  onFinish?: (result: T | undefined, error: unknown, usage: LanguageModelUsage) => Promise<void>
  onError?: (error: unknown) => Promise<void>
}

/**
 * Stream AI response as partial object while they are being generated
 */
export const streamResponse = async <T>(params: StreamParams<T>) => {
  const result = streamObject({
    ...params,
    onFinish: async ({ object, error, usage }) => {
      if (params.onFinish) {
        await params.onFinish(object as T | undefined, error, usage)
      }
    },
    onError: async (error) => {
      if (params.onError) {
        await params.onError(error)
      }
    },
  })

  return result.toTextStreamResponse()
}

/**
 * Generate AI response as a complete object
 */
export const generateResponse = async <T>(params: BaseAIParams<T>) => {
  try {
    const { object } = await generateObject(params)
    return object
  } catch (error) {
    throw error
  }
}
