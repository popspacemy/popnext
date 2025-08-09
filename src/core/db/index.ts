import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const connectionString = process.env.DATABASE_URL!

export const db = drizzle(
  postgres(connectionString, {
    prepare: false,
    connect_timeout: 10,
    max: 10, // Set the maximum number of connections in the pool
    idle_timeout: 20, // Close idle connections after 20 seconds
  })
)
