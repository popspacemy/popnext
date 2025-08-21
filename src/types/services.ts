import { StreamObjectResult } from "ai"
import { PgTransaction } from "drizzle-orm/pg-core"

import { ErrorResponse } from "./errors"

export interface BaseServiceResult {
  success: boolean | null
  error?: ErrorResponse | null
}

export type GetAllDataResult<T> = BaseServiceResult & {
  data: T[]
  totalRecords: number
}

export interface GetPreviewData<T, U = object> {
  id: string
  title: { en: string; ms: string }
  details: T[]
  additionalDetails: U
  createdDate: Date
}

export type GetListDataResult<T> = GetAllDataResult<GetPreviewData<T>>

export type GetDataResult<T> = BaseServiceResult & {
  data: T | null
}

export type SaveDataResult<T> = BaseServiceResult & {
  data: T | null
}

export type StreamGenerationResult = BaseServiceResult & {
  isStreaming: boolean
  data: StreamObjectResult<unknown, unknown, never> | null
}

export type GetGenerationResult<T> = BaseServiceResult & {
  data: T | unknown
}

export type Transaction = PgTransaction<any, any, any>
