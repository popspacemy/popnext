export interface BaseError {
  success: false
}

export interface ErrorDetails {
  name?: string
  message: string
  code: string
  stack?: unknown
  publicMessage: string
  status: number
}

export interface ErrorResponse {
  code: string
  message: string
  status: number
}

export interface ApiError extends BaseError {
  error: ErrorResponse
  details?: unknown
}

export interface ServiceError extends BaseError {
  error: ErrorResponse
}
