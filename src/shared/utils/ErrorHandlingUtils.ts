import { Logger } from '../utils/LoggingUtils';
import { AppConfig } from '../config/AppConfig';

/**
 * Custom error class for Excel-specific errors, extending the built-in Error class.
 */
export class ExcelError extends Error {
    code: string;
    details: any;

    constructor(code: string, message: string, details?: any) {
        super(message);
        this.name = 'ExcelError';
        this.code = code;
        this.details = details;
    }
}

/**
 * A type guard function to check if an error is an instance of ExcelError.
 * @param error - The error to check
 * @returns True if the error is an instance of ExcelError, false otherwise
 */
export function isExcelError(error: any): error is ExcelError {
    return (
        error instanceof Error &&
        error.name === 'ExcelError' &&
        typeof (error as ExcelError).code === 'string' &&
        'details' in error
    );
}

/**
 * A utility function to handle and log errors consistently across the application.
 * @param error - The error object or error message
 * @param errorCode - The error code (optional)
 */
export function handleError(error: Error | string, errorCode?: string): void {
    let excelError: ExcelError;

    if (typeof error === 'string') {
        excelError = new ExcelError(errorCode || 'UNKNOWN_ERROR', error);
    } else if (isExcelError(error)) {
        excelError = error;
    } else {
        excelError = new ExcelError(errorCode || 'UNKNOWN_ERROR', error.message, error);
    }

    // Log the error using the Logger from LoggingUtils
    Logger.error('Error occurred:', {
        code: excelError.code,
        message: excelError.message,
        details: excelError.details,
        stack: excelError.stack
    });

    // Perform any additional error handling actions based on AppConfig settings
    const errorHandlingConfig = AppConfig.getErrorHandlingConfig();

    if (errorHandlingConfig.showErrorDialogs) {
        // Display error dialog to the user (implementation depends on the UI framework)
        showErrorDialog(excelError);
    }

    if (errorHandlingConfig.reportErrorsToServer) {
        // Send error report to the server (implementation depends on the API service)
        sendErrorReport(excelError);
    }
}

/**
 * Display an error dialog to the user.
 * @param error - The ExcelError to display
 */
function showErrorDialog(error: ExcelError): void {
    // Implementation depends on the UI framework being used
    console.error('Error Dialog:', error.message);
}

/**
 * Send an error report to the server.
 * @param error - The ExcelError to report
 */
function sendErrorReport(error: ExcelError): void {
    // Implementation depends on the API service being used
    console.warn('Sending error report to server:', error);
}

// Export the error handling utilities
export const ErrorHandlingUtils = {
    ExcelError,
    isExcelError,
    handleError
};