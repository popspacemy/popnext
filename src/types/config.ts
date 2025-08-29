import type { BetterAuthOptions } from "better-auth"

export interface PopnextAuthConfig {
  hooks?: BetterAuthOptions["hooks"]
  plugins?: BetterAuthOptions["plugins"]
  [key: string]: any
}

export interface PopnextConfig {
  auth?: PopnextAuthConfig
}