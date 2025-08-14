import type { ServiceError } from "@/types"
import type { LanguageModelUsage } from "ai"

export interface GenerationOnFinishParams<T> {
  result?: T
  error?: unknown
  usage?: LanguageModelUsage
}

export type GenerationOnFinish<T> = (
  params: GenerationOnFinishParams<T>
) => Promise<void | ServiceError>

export type GenerationOnError = (error: unknown) => Promise<void | ServiceError>
