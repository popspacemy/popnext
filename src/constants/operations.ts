export const REQUEST_SOURCE = {
  App: "app",
  ServerAction: "server-action",
  Webhook: "webhook",
  Api: "api",
  Auth: "auth",
  LibAi: "lib-ai",
  Others: "others",
} as const

export const ERROR_SOURCE = {
  App: "app",
  ServerAction: "server-action",
  Webhook: "webhook",
  Api: "api",
  Service: "service",
} as const

export type RequestSource = (typeof REQUEST_SOURCE)[keyof typeof REQUEST_SOURCE]
export type ErrorSource = (typeof ERROR_SOURCE)[keyof typeof ERROR_SOURCE]
