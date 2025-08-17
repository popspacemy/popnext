import { ErrorSource, RequestSource } from "../constants/operations"
import { HttpMethod } from "./requests"

export interface AdditionalDetails {
  errorSource?: ErrorSource
  message?: string
  [key: string]: unknown
}

export interface Context {
  correlationId?: string
  userId?: string
  requestHandler?: string
  requestSource?: RequestSource
  operation?: string
  endpoint?: string
  method?: HttpMethod
  [key: string]: unknown
}
