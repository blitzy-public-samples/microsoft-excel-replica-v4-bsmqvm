/**
 * ErrorTypeEnum
 * 
 * This enum defines various types of errors that can occur within the Microsoft Excel application.
 * It is used to standardize error handling and reporting across the application.
 */
export enum ErrorTypeEnum {
    /** Represents errors occurring during formula calculations */
    CALCULATION_ERROR = 'CALCULATION_ERROR',

    /** Indicates errors related to data validation rules */
    DATA_VALIDATION_ERROR = 'DATA_VALIDATION_ERROR',

    /** Represents errors during file read/write operations */
    FILE_IO_ERROR = 'FILE_IO_ERROR',

    /** Indicates errors related to network connectivity or API calls */
    NETWORK_ERROR = 'NETWORK_ERROR',

    /** Represents errors due to insufficient user permissions */
    PERMISSION_ERROR = 'PERMISSION_ERROR',

    /** Indicates errors in formula or function syntax */
    SYNTAX_ERROR = 'SYNTAX_ERROR',

    /** Represents errors due to invalid cell or range references */
    REFERENCE_ERROR = 'REFERENCE_ERROR',

    /** Indicates errors when a value is of the wrong type */
    VALUE_ERROR = 'VALUE_ERROR',

    /** Represents errors when a named range or function is not found */
    NAME_ERROR = 'NAME_ERROR',

    /** Indicates division by zero errors */
    DIV_ZERO_ERROR = 'DIV_ZERO_ERROR',

    /** Represents errors when a required value is null or undefined */
    NULL_ERROR = 'NULL_ERROR',

    /** Indicates errors during data import operations */
    IMPORT_ERROR = 'IMPORT_ERROR',

    /** Represents errors during data export operations */
    EXPORT_ERROR = 'EXPORT_ERROR',

    /** Indicates errors related to chart creation or manipulation */
    CHART_ERROR = 'CHART_ERROR',

    /** Represents errors related to add-in functionality */
    ADD_IN_ERROR = 'ADD_IN_ERROR',

    /** Indicates errors during real-time collaboration */
    COLLABORATION_ERROR = 'COLLABORATION_ERROR',

    /** Represents any unspecified or unexpected errors */
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * This enum is used throughout the Microsoft Excel application to standardize error handling and reporting.
 * It addresses the following requirements:
 * 1. Error Standardization: Provides a consistent set of error types for the application
 * 2. Error Handling: Supports robust error handling across the application
 * 
 * Usage example:
 * 
 * import { ErrorTypeEnum } from '../shared/enums/ErrorTypeEnum';
 * 
 * function handleError(error: Error): ErrorTypeEnum {
 *   if (error instanceof ReferenceError) {
 *     return ErrorTypeEnum.REFERENCE_ERROR;
 *   } else if (error instanceof TypeError) {
 *     return ErrorTypeEnum.VALUE_ERROR;
 *   }
 *   // ... handle other error types
 *   return ErrorTypeEnum.UNKNOWN_ERROR;
 * }
 */