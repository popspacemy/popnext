import { authClient } from "../core/auth/client"

export type Session = typeof authClient.$Infer.Session
export type AuthUser = Session["user"]

export interface UserSettings {
  theme: "light" | "dark"
}

export interface UserSubscription {
  isPro: boolean
  usageCredits: number
}

export interface AuthUserContext {
  session: Session | null
}
