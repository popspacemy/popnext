import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

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

export const auth: ReturnType<typeof betterAuth> = betterAuth({ ...authConfig, plugins })
