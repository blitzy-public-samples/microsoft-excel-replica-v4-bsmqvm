/**
 * LocalizationError.ts
 * 
 * This file defines a custom error class for handling localization-related errors in Microsoft Excel.
 * It addresses the following requirements:
 * - Cross-platform Accessibility: Ensure consistent functionality and user experience across desktop, web, and mobile platforms
 * - Accessibility: Ensure the application is usable by people with diverse abilities and needs
 */

/**
 * A custom error class for handling localization-related errors in Microsoft Excel.
 */
export class LocalizationError extends Error {
    /**
     * The error code associated with this localization error.
     */
    public readonly code: string;

    /**
     * Creates a new instance of LocalizationError.
     * @param message The error message describing the localization issue.
     * @param code The error code associated with this localization error.
     */
    constructor(message: string, code: string) {
        super(message);

        // Set the error message
        this.message = message;

        // Set the error code
        this.code = code;

        // Set the name of the error class
        this.name = 'LocalizationError';

        // This line is necessary for proper prototype chain inheritance in TypeScript
        Object.setPrototypeOf(this, LocalizationError.prototype);

        // Capture the stack trace, excluding the constructor call from it
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, LocalizationError);
        }
    }

    /**
     * Returns a string representation of the error, including the error code.
     * @returns A string representation of the error.
     */
    public toString(): string {
        return `${this.name} [${this.code}]: ${this.message}`;
    }
}

// Example usage:
// throw new LocalizationError('Unable to load language pack', 'LOC_001');