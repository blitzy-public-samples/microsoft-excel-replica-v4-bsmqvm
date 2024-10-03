/**
 * This file serves as the main entry point for exporting utility functions used throughout the Microsoft Excel application.
 * It centralizes and exports utility functions to ensure consistent utility function access across platforms.
 */

// Import all utility functions from their respective modules
import * as MathUtils from './MathUtils';
import * as StringUtils from './StringUtils';
import * as DateUtils from './DateUtils';
import * as ValidationUtils from './ValidationUtils';
import * as FormatUtils from './FormatUtils';
import * as EncryptionUtils from './EncryptionUtils';
import * as LocalizationUtils from './LocalizationUtils';
import * as LoggingUtils from './LoggingUtils';
import * as ErrorHandlingUtils from './ErrorHandlingUtils';

// Export all imported utility functions
export {
  MathUtils,
  StringUtils,
  DateUtils,
  ValidationUtils,
  FormatUtils,
  EncryptionUtils,
  LocalizationUtils,
  LoggingUtils,
  ErrorHandlingUtils
};

// Re-export individual functions from each utility module
// This allows for more granular imports if needed
export * from './MathUtils';
export * from './StringUtils';
export * from './DateUtils';
export * from './ValidationUtils';
export * from './FormatUtils';
export * from './EncryptionUtils';
export * from './LocalizationUtils';
export * from './LoggingUtils';
export * from './ErrorHandlingUtils';

/**
 * TODO: Implement utility functions in their respective files:
 * - MathUtils.ts: Mathematical utility functions
 * - StringUtils.ts: String manipulation and processing functions
 * - DateUtils.ts: Date and time related functions
 * - ValidationUtils.ts: Data validation functions
 * - FormatUtils.ts: Formatting functions for various data types
 * - EncryptionUtils.ts: Data encryption and decryption functions
 * - LocalizationUtils.ts: Localization and internationalization functions
 * - LoggingUtils.ts: Logging and debugging functions
 * - ErrorHandlingUtils.ts: Error handling and reporting functions
 */