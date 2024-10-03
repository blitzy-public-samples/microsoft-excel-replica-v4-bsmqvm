// This file serves as a central export point for all enumeration types defined in the shared/enums directory
// of the Microsoft Excel project. It consolidates various enums used throughout the application for easy
// import and usage in other modules.

// Import enums from their respective files
import { CellFormatEnum } from './CellFormatEnum';
import { ChartTypeEnum } from './ChartTypeEnum';
import { ErrorTypeEnum } from './ErrorTypeEnum';
import { FormulaTypeEnum } from './FormulaTypeEnum';
import { UserRoleEnum } from './UserRoleEnum';

// Export all enums
export {
    CellFormatEnum,
    ChartTypeEnum,
    ErrorTypeEnum,
    FormulaTypeEnum,
    UserRoleEnum
};

// Optionally, you can also export them as a namespace for grouped access
export namespace ExcelEnums {
    export const CellFormat = CellFormatEnum;
    export const ChartType = ChartTypeEnum;
    export const ErrorType = ErrorTypeEnum;
    export const FormulaType = FormulaTypeEnum;
    export const UserRole = UserRoleEnum;
}

// Export any additional types or interfaces related to enums if needed
// For example:
// export type CellFormatType = keyof typeof CellFormatEnum;
// export type ChartTypeType = keyof typeof ChartTypeEnum;
// ... and so on for other enums if required

/**
 * This centralized export approach offers several benefits:
 * 1. It provides a single point of import for all enum types, reducing import statements in other files.
 * 2. It ensures consistent use of enums across different platforms and components.
 * 3. It improves code organization and maintainability by keeping all enum exports in one place.
 * 4. It allows for easy addition of new enum types in the future without modifying import statements in other files.
 */