import { ErrorCodes } from '../constants/ErrorCodes';

/**
 * This file contains constant values used throughout the Microsoft Excel application,
 * providing a centralized location for important application-wide constants.
 */

// Maximum number of rows in a worksheet
export const MAX_ROWS: number = 1048576;

// Maximum number of columns in a worksheet
export const MAX_COLUMNS: number = 16384;

// Default font for cells
export const DEFAULT_FONT: string = 'Calibri';

// Default font size for cells
export const DEFAULT_FONT_SIZE: number = 11;

// Maximum length of a formula
export const MAX_FORMULA_LENGTH: number = 8192;

// Maximum number of characters in a cell
export const MAX_CELL_CHARACTERS: number = 32767;

// Default column width in characters
export const DEFAULT_COLUMN_WIDTH: number = 8.43;

// Default row height in points
export const DEFAULT_ROW_HEIGHT: number = 15;

// Maximum length of a worksheet name
export const MAX_WORKSHEET_NAME_LENGTH: number = 31;

// Maximum size of a workbook in bytes (1 GB)
export const MAX_WORKBOOK_SIZE: number = 1024 * 1024 * 1024;

// Auto-save interval in milliseconds (5 minutes)
export const AUTO_SAVE_INTERVAL: number = 5 * 60 * 1000;

// Maximum number of undo/redo actions
export const MAX_UNDO_HISTORY: number = 100;

// Default number of decimal places for number formatting
export const DEFAULT_DECIMAL_PLACES: number = 2;

// Maximum zoom level percentage
export const MAX_ZOOM_LEVEL: number = 400;

// Minimum zoom level percentage
export const MIN_ZOOM_LEVEL: number = 10;

// Constants related to cross-platform accessibility
export const ACCESSIBILITY = {
  MIN_FONT_SIZE: 8,
  MAX_FONT_SIZE: 72,
  DEFAULT_HIGH_CONTRAST_THEME: 'high-contrast-1',
};

// Constants related to performance
export const PERFORMANCE = {
  LAZY_LOADING_THRESHOLD: 1000, // Number of cells to render initially
  VIRTUALIZATION_BUFFER: 50, // Number of extra rows/columns to render outside the viewport
  MAX_CELLS_BEFORE_OPTIMIZATION: 100000, // Threshold for applying performance optimizations
};

// Constants related to security and compliance
export const SECURITY = {
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_REQUIRE_SPECIAL_CHAR: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
};

// Export ErrorCodes to make them available alongside AppConstants
export { ErrorCodes };