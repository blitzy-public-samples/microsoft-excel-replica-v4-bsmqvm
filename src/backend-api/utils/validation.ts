import validator from 'validator';
import xss from 'xss';
import { createErrorResponse } from '../utils/apiResponse';

/**
 * Validates if the input is a string within the specified length range.
 * @param input The input string to validate
 * @param minLength The minimum allowed length
 * @param maxLength The maximum allowed length
 * @returns Whether the input is valid or not
 */
export function validateString(input: string, minLength: number, maxLength: number): boolean {
    if (typeof input !== 'string') {
        return false;
    }
    const length = input.trim().length;
    return length >= minLength && length <= maxLength;
}

/**
 * Validates if the input is a valid number.
 * @param input The input to validate
 * @returns Whether the input is a valid number or not
 */
export function validateNumber(input: any): boolean {
    if (typeof input === 'number') {
        return !isNaN(input);
    }
    if (typeof input === 'string') {
        return validator.isNumeric(input);
    }
    return false;
}

/**
 * Validates if the input is a valid email address.
 * @param email The email address to validate
 * @returns Whether the email is valid or not
 */
export function validateEmail(email: string): boolean {
    return validator.isEmail(email);
}

/**
 * Sanitizes the input string to prevent XSS attacks.
 * @param input The input string to sanitize
 * @returns Sanitized input string
 */
export function sanitizeInput(input: string): string {
    return xss(input);
}

/**
 * Validates if the input is a valid workbook name.
 * @param name The workbook name to validate
 * @returns Whether the workbook name is valid or not
 */
export function validateWorkbookName(name: string): boolean {
    if (!validateString(name, 1, 255)) {
        return false;
    }
    // Allow alphanumeric characters, spaces, and common punctuation
    const validNameRegex = /^[a-zA-Z0-9 .,_-]+$/;
    return validNameRegex.test(name);
}

/**
 * Validates if the input is a valid cell reference (e.g., A1, B2, etc.).
 * @param cellRef The cell reference to validate
 * @returns Whether the cell reference is valid or not
 */
export function validateCellReference(cellRef: string): boolean {
    if (typeof cellRef !== 'string') {
        return false;
    }
    const cellRefRegex = /^[A-Z]+[1-9]\d*$/;
    return cellRefRegex.test(cellRef);
}

/**
 * Middleware function to validate request inputs.
 * @param schema The Joi schema to validate against
 * @returns Express middleware function
 */
export function validateRequest(schema: any) {
    return (req: any, res: any, next: any) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json(createErrorResponse('Validation error', error.details[0].message));
        }
        next();
    };
}

// Export all validation functions
export const ValidationUtils = {
    validateString,
    validateNumber,
    validateEmail,
    sanitizeInput,
    validateWorkbookName,
    validateCellReference,
    validateRequest,
};