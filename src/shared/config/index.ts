/**
 * @file index.ts
 * @description This file serves as the main entry point for exporting configuration-related modules and constants in the Microsoft Excel project.
 */

// Import configuration modules
import * as AppConfig from './AppConfig';
import * as ApiConfig from './ApiConfig';
import * as SecurityConfig from './SecurityConfig';

// Export configuration modules
export { AppConfig, ApiConfig, SecurityConfig };

/**
 * @constant DEFAULT_CONFIG
 * @description Default configuration object that combines all config modules
 */
export const DEFAULT_CONFIG = {
  app: AppConfig,
  api: ApiConfig,
  security: SecurityConfig,
};

/**
 * @function getConfig
 * @description Helper function to retrieve configuration values
 * @param {string} module - The configuration module name
 * @param {string} key - The configuration key
 * @returns {any} The configuration value
 */
export function getConfig(module: string, key: string): any {
  if (DEFAULT_CONFIG[module] && DEFAULT_CONFIG[module][key] !== undefined) {
    return DEFAULT_CONFIG[module][key];
  }
  throw new Error(`Configuration not found for module: ${module}, key: ${key}`);
}

/**
 * @function setConfig
 * @description Helper function to set configuration values
 * @param {string} module - The configuration module name
 * @param {string} key - The configuration key
 * @param {any} value - The configuration value to set
 */
export function setConfig(module: string, key: string, value: any): void {
  if (DEFAULT_CONFIG[module]) {
    DEFAULT_CONFIG[module][key] = value;
  } else {
    throw new Error(`Configuration module not found: ${module}`);
  }
}

// Export types for better type checking
export type AppConfigType = typeof AppConfig;
export type ApiConfigType = typeof ApiConfig;
export type SecurityConfigType = typeof SecurityConfig;

/**
 * @interface ConfigModules
 * @description Interface for the configuration modules
 */
export interface ConfigModules {
  app: AppConfigType;
  api: ApiConfigType;
  security: SecurityConfigType;
}

// Human tasks:
// TODO: Implement AppConfig module with application-specific settings
// TODO: Implement ApiConfig module with API-related configurations
// TODO: Implement SecurityConfig module with security-related settings
// TODO: Add any additional configuration modules as needed
// TODO: Update this file when new configuration modules are added