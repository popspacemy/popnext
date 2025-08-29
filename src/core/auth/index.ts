import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { loadPopnextConfig } from "../../utils/config"
import { db } from "../db"
import * as schema from "./schema"

// We export this config so that it can also be used by scripts,
// in which case we can initialize better-auth without plugins
export const authConfig = {
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      users: schema.usersSchema,
      sessions: schema.sessionsSchema,
      accounts: schema.accountsSchema,
      verifications: schema.verificationsSchema,
    },
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
}

export const plugins = [
  // This will add the session to the request and will also allow type inference for session.
  // However, this will not work when it's called from outside of Next.js (e.g. from DB seeding)
  nextCookies(),
]

// Singleton auth instance
let authInstance: ReturnType<typeof betterAuth> | null = null

export function getAuth(): ReturnType<typeof betterAuth> {
  if (!authInstance) {
    const consumerConfig = loadPopnextConfig()

    // Merge user config with base config
    const mergedConfig = {
      ...authConfig,
      plugins: consumerConfig?.auth?.plugins
        ? [...plugins, ...consumerConfig.auth.plugins]
        : plugins,
      hooks: consumerConfig?.auth?.hooks,
      ...consumerConfig?.auth,
    }

    authInstance = betterAuth(mergedConfig)
  }

  return authInstance
}

// For backward compatibility - use the singleton instance
export const auth: ReturnType<typeof betterAuth> = getAuth()

// Reset function for testing
export function resetAuthInstance() {
  authInstance = null
}
