import { resolve } from "path"
import type { PopnextConfig } from "../types/config"

let cachedConfig: PopnextConfig | null = null

export function loadPopnextConfig(): PopnextConfig | null {
  if (cachedConfig !== null) {
    return cachedConfig
  }

  try {
    // Look for popnext.config.ts in the consumer's root directory
    const configPath = resolve(process.cwd(), "popnext.config.ts")
    
    // Dynamic import to handle both CommonJS and ESM
    const configModule = require(configPath)
    cachedConfig = configModule.default || configModule
    
    return cachedConfig
  } catch (error) {
    // Config file not found or invalid - return null to use defaults
    cachedConfig = {}
    return cachedConfig
  }
}

export function resetConfigCache() {
  cachedConfig = null
}