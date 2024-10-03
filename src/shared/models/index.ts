/**
 * index.ts
 * 
 * This file serves as the central export point for all model classes in the shared models directory
 * of the Microsoft Excel project. It aggregates and re-exports the model classes to provide a single,
 * convenient import location for other parts of the application.
 */

// Import all model classes
import { BaseModel } from './BaseModel';
import { CellModel } from './CellModel';
import { WorksheetModel } from './WorksheetModel';
import { WorkbookModel } from './WorkbookModel';
import { ChartModel } from './ChartModel';
import { UserModel } from './UserModel';

// Re-export all model classes
export {
    BaseModel,
    CellModel,
    WorksheetModel,
    WorkbookModel,
    ChartModel,
    UserModel
};

// Export a namespace containing all models for convenient access
export namespace Models {
    export const Base = BaseModel;
    export const Cell = CellModel;
    export const Worksheet = WorksheetModel;
    export const Workbook = WorkbookModel;
    export const Chart = ChartModel;
    export const User = UserModel;
}

/**
 * This file addresses the following requirements:
 * 1. Data Management: By providing a centralized location for all model classes,
 *    it supports efficient input, storage, and organization of structured data.
 * 2. Cross-platform Accessibility: The unified export of models ensures consistent
 *    functionality and data structures across desktop, web, and mobile platforms.
 */