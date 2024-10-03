/**
 * This file serves as the main entry point for exporting decorators used across the Microsoft Excel application.
 * It aggregates and re-exports decorators from various files within the decorators directory,
 * providing a centralized access point for these utilities.
 */

// Import decorators from their respective files
import { Memoize } from './Memoize';
import { Throttle } from './Throttle';
import { ValidateInput } from './ValidateInput';

// Re-export the decorators
export {
    Memoize,
    Throttle,
    ValidateInput
};

// Optionally, we can also export them as a namespace
export namespace Decorators {
    export const memoize = Memoize;
    export const throttle = Throttle;
    export const validateInput = ValidateInput;
}

/**
 * Usage example:
 * 
 * import { Memoize, Throttle, ValidateInput } from 'src/shared/decorators';
 * 
 * or
 * 
 * import { Decorators } from 'src/shared/decorators';
 * Decorators.memoize(...)
 */