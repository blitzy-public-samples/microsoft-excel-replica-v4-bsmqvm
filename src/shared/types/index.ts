/**
 * This file serves as the main entry point for exporting all shared types used across the Microsoft Excel application.
 * It aggregates and re-exports type definitions from various other files in the shared/types directory.
 */

// Import all types from CellTypes
import * as CellTypes from './CellTypes';

// Import all types from ChartTypes
import * as ChartTypes from './ChartTypes';

// Import all types from FormulaTypes
import * as FormulaTypes from './FormulaTypes';

// Re-export all imported types
export { CellTypes, ChartTypes, FormulaTypes };

// Additional exports can be added here if needed in the future

/**
 * @fileoverview This file addresses the following requirements:
 * 1. Data Management: Provide a robust platform for efficient input, storage, and organization of structured data
 * 2. Cross-platform Accessibility: Ensure consistent functionality and user experience across desktop, web, and mobile platforms
 */