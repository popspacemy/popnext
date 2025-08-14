import type { LanguageModelUsage } from "ai"

export interface GenerationOnFinishParams<T> {
  result?: T
  error?: unknown
  usage?: LanguageModelUsage
}
