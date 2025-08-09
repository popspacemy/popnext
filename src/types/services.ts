import { ErrorResponse } from "./errors"

export interface BaseServiceResult {
  success: boolean
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
