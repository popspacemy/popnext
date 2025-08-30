import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { loadPopnextConfig } from "../../utils/config"
import { db } from "../db"
import * as schema from "./schema"

type AuthInstance = ReturnType<typeof betterAuth>

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

let authInstance: AuthInstance | null = null

/**
 * Merges user configuration with base configuration
 * Handles arrays (plugins) and objects (hooks) intelligently
 */
function mergeAuthConfig(baseConfig: any, userConfig: any) {
  const merged = { ...baseConfig }

  if (userConfig.plugins && Array.isArray(userConfig.plugins)) {
    merged.plugins = [...plugins, ...userConfig.plugins]
  } else {
    merged.plugins = plugins
  }

  if (userConfig.hooks) {
    merged.hooks = userConfig.hooks
  }

  Object.keys(userConfig).forEach((key) => {
    if (key !== "hooks" && key !== "plugins") {
      merged[key] = userConfig[key]
    }
  })

  return merged
}

/**
 * Gets or creates the auth instance with merged configuration
 * This function handles lazy initialization and config merging
 */
export function getAuth(): AuthInstance {
  if (!authInstance) {
    const userConfig = loadPopnextConfig()

    const finalConfig = userConfig?.auth
      ? mergeAuthConfig(authConfig, userConfig.auth)
      : { ...authConfig, plugins }

    authInstance = betterAuth(finalConfig)
  }

  return authInstance
}

/**
 * The main auth export using a Proxy for lazy initialization
 * This ensures zero race conditions - every access triggers lazy loading
 */
export const auth: AuthInstance = new Proxy({} as AuthInstance, {
  get(target, prop, receiver) {
    const instance = getAuth()
    const value = instance[prop as keyof AuthInstance]

    // Bind functions to the instance to maintain 'this' context
    if (typeof value === "function") {
      return value.bind(instance)
    }

    return value
  },

  has(target, prop) {
    const instance = getAuth()
    return prop in instance
  },

  ownKeys(target) {
    const instance = getAuth()
    return Reflect.ownKeys(instance)
  },

  getOwnPropertyDescriptor(target, prop) {
    const instance = getAuth()
    return Reflect.getOwnPropertyDescriptor(instance, prop)
  },
}) as AuthInstance

/**
 * Reset function for testing - clears the singleton instance
 * Use this in test setup to ensure clean state between tests
 */
export function resetAuthInstance() {
  authInstance = null
}
