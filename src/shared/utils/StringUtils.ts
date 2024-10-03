/**
 * StringUtils.ts
 * 
 * This file contains utility functions for string manipulation and processing
 * in the Microsoft Excel application.
 */

import { MAX_CELL_CHARACTERS } from '../constants/AppConstants';

/**
 * Removes leading and trailing whitespace from a given string.
 * @param str - The input string to trim.
 * @returns The trimmed string.
 */
export function trimString(str: string): string {
    return str.trim();
}

/**
 * Capitalizes the first letter of a given string.
 * @param str - The input string to capitalize.
 * @returns The string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str: string): string {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified maximum length, adding an ellipsis if truncated.
 * @param str - The input string to truncate.
 * @param maxLength - The maximum length of the resulting string.
 * @returns The truncated string.
 */
export function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
}

/**
 * Checks if a string is empty, null, or undefined.
 * @param str - The input string to check.
 * @returns True if the string is empty, null, or undefined; false otherwise.
 */
export function isStringEmpty(str: string | null | undefined): boolean {
    return str === null || str === undefined || str.trim() === '';
}

/**
 * Formats a cell reference from row and column numbers (e.g., A1, B2).
 * @param row - The row number (1-based).
 * @param column - The column number (1-based).
 * @returns The formatted cell reference string.
 */
export function formatCellReference(row: number, column: number): string {
    const columnLetter = String.fromCharCode(64 + column);
    return `${columnLetter}${row}`;
}

/**
 * Parses a cell reference string into row and column numbers.
 * @param cellRef - The cell reference string (e.g., A1, B2).
 * @returns An object containing the row and column numbers.
 */
export function parseCellReference(cellRef: string): { row: number; column: number } {
    const match = cellRef.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new Error('Invalid cell reference');

    const column = match[1].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0);
    const row = parseInt(match[2], 10);

    return { row, column };
}

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param str - The input string to escape.
 * @returns The escaped string.
 */
export function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitizes user input to prevent XSS attacks and ensure safe string handling.
 * @param input - The user input string to sanitize.
 * @returns The sanitized string.
 */
export function sanitizeInput(input: string): string {
    // Replace potentially harmful characters with their HTML entity equivalents
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Ensures that a string does not exceed the maximum allowed length for a cell.
 * @param str - The input string to check and truncate if necessary.
 * @returns The string, truncated if it exceeds the maximum allowed length.
 */
export function ensureMaxCellLength(str: string): string {
    return truncateString(str, MAX_CELL_CHARACTERS);
}

/**
 * Converts a string to camelCase.
 * @param str - The input string to convert.
 * @returns The camelCase version of the input string.
 */
export function toCamelCase(str: string): string {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
}

/**
 * Converts a string to snake_case.
 * @param str - The input string to convert.
 * @returns The snake_case version of the input string.
 */
export function toSnakeCase(str: string): string {
    return str
        .replace(/\s+/g, '_')
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '');
}

/**
 * Checks if a string contains only alphanumeric characters.
 * @param str - The input string to check.
 * @returns True if the string contains only alphanumeric characters, false otherwise.
 */
export function isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
}

// TODO: Implement additional string utility functions as needed for Excel operations