import type { LanguageModel, LanguageModelUsage } from "ai"
import type { ZodType } from "zod/v4"

import type { ServiceError } from "./errors"

export interface BaseAIParams<T> {
  system: string
  prompt: string
  schema: ZodType
  mode: "json" | "auto" | "tool"
  model: LanguageModel
  temperature: number
  maxTokens: number
}

export interface StreamParams<T> extends BaseAIParams<T> {
  onFinish?: GenerationOnFinish<T>
  onError?: GenerationOnError
}

export interface GenerationOnFinishParams<T> {
  result?: T
  error?: unknown
  usage?: LanguageModelUsage
}

export type GenerationOnFinish<T> = (
  params: GenerationOnFinishParams<T>
) => Promise<void | ServiceError>

export type GenerationOnError = (error: unknown) => Promise<void | ServiceError>
