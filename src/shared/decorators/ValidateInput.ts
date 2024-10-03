import { ValidationRule } from './types';

/**
 * Decorator function to validate input parameters of a method before its execution.
 * @param validationRules An array of ValidationRule objects specifying the validation rules.
 * @returns A MethodDecorator that applies the specified validation rules.
 */
export function ValidateInput(validationRules: ValidationRule[]): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      for (const rule of validationRules) {
        const paramValue = args[rule.paramIndex];
        const isValid = rule.validator(paramValue);

        if (!isValid) {
          throw new Error(rule.errorMessage);
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Interface defining the structure of a validation rule.
 */
export interface ValidationRule {
  /** The index of the parameter to validate. */
  paramIndex: number;
  /** The validation function that returns true if the parameter is valid, false otherwise. */
  validator: (value: any) => boolean;
  /** The error message to throw if the validation fails. */
  errorMessage: string;
}

// Example usage:
// @ValidateInput([
//   {
//     paramIndex: 0,
//     validator: (value) => typeof value === 'string' && value.length > 0,
//     errorMessage: 'First parameter must be a non-empty string'
//   },
//   {
//     paramIndex: 1,
//     validator: (value) => typeof value === 'number' && value > 0,
//     errorMessage: 'Second parameter must be a positive number'
//   }
// ])
// function exampleMethod(str: string, num: number) {
//   // Method implementation
// }