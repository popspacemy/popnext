import { resolve } from "path"

import type { PopnextConfig } from "../types/config"

let cachedConfig: PopnextConfig | null = null
let configLoadAttempted = false

/**
 * Loads the popnext configuration from various possible locations
 * Supports both .js and .ts extensions
 * Caches the result for performance
 */
export function loadPopnextConfig(): PopnextConfig | null {
  // Return cached config if already loaded
  if (configLoadAttempted) {
    return cachedConfig
  }

  const configPaths = [
    "popnext.config.ts",
    "popnext.config.js",
    "config/popnext.config.ts",
    "config/popnext.config.js",
    "popnext.config.mjs",
    "popnext.config.cjs",
  ]

  for (const configPath of configPaths) {
    try {
      const fullPath = resolve(process.cwd(), configPath)

      // Clear require cache in development for hot reloading
      if (process.env.NODE_ENV === "development") {
        delete require.cache[fullPath]
      }

      const configModule = require(fullPath)
      const config = configModule.default || configModule

      cachedConfig = config
      configLoadAttempted = true

      return cachedConfig
    } catch (error) {
      // Continue to next path if this one fails
      continue
    }
  }

  // No config file found - cache null result
  configLoadAttempted = true
  cachedConfig = null

  return null
}

/**
 * Reset the config cache - useful for testing or hot reloading
 */
export function resetConfigCache() {
  cachedConfig = null
  configLoadAttempted = false
}
