import { format } from 'date-fns';
import numeral from 'numeral';
import { round } from '../utils/MathUtils';
import { CellFormatEnum } from '../enums/CellFormatEnum';
import { CellType } from '../types/CellTypes';
import { ICell } from '../interfaces/ICell';
import { AppConfig } from '../config/AppConfig';

// Global constants
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const DEFAULT_NUMBER_FORMAT = '0,0.00';
const DEFAULT_CURRENCY_FORMAT = '$0,0.00';

/**
 * Formats a number according to the specified format string.
 * @param value The number to format
 * @param format The format string to apply
 * @returns The formatted number string
 */
export function formatNumber(value: number, format: string): string {
    if (typeof value !== 'number' || isNaN(value)) {
        return '';
    }
    return numeral(value).format(format);
}

/**
 * Formats a date according to the specified format string.
 * @param value The date to format
 * @param formatString The format string to apply
 * @returns The formatted date string
 */
export function formatDate(value: Date, formatString: string): string {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
        return '';
    }
    return format(value, formatString);
}

/**
 * Formats a number as currency according to the specified currency code and format string.
 * @param value The number to format as currency
 * @param currencyCode The currency code to use
 * @param formatString The format string to apply
 * @returns The formatted currency string
 */
export function formatCurrency(value: number, currencyCode: string, formatString: string): string {
    if (typeof value !== 'number' || isNaN(value)) {
        return '';
    }
    return numeral(value).format(formatString).replace('$', currencyCode);
}

/**
 * Formats a number as a percentage with the specified number of decimal places.
 * @param value The number to format as a percentage
 * @param decimalPlaces The number of decimal places to display
 * @returns The formatted percentage string
 */
export function formatPercentage(value: number, decimalPlaces: number): string {
    if (typeof value !== 'number' || isNaN(value)) {
        return '';
    }
    const percentage = value * 100;
    const roundedPercentage = round(percentage, decimalPlaces);
    return `${roundedPercentage}%`;
}

/**
 * Formats a cell's value based on its type and format.
 * @param cell The cell to format
 * @returns The formatted cell value
 */
export function formatCell(cell: ICell): string {
    switch (cell.type) {
        case CellType.Number:
            return formatNumber(cell.value as number, cell.format || DEFAULT_NUMBER_FORMAT);
        case CellType.Date:
            return formatDate(cell.value as Date, cell.format || DEFAULT_DATE_FORMAT);
        case CellType.Currency:
            return formatCurrency(cell.value as number, AppConfig.defaultCurrency, cell.format || DEFAULT_CURRENCY_FORMAT);
        case CellType.Percentage:
            return formatPercentage(cell.value as number, AppConfig.defaultDecimalPlaces);
        default:
            return cell.value?.toString() || '';
    }
}

/**
 * Applies a specific number format to a numeric value.
 * @param value The numeric value to format
 * @param format The CellFormatEnum value specifying the format to apply
 * @returns The formatted number string
 */
export function applyNumberFormat(value: number, format: CellFormatEnum): string {
    if (typeof value !== 'number' || isNaN(value)) {
        return '';
    }

    switch (format) {
        case CellFormatEnum.General:
            return value.toString();
        case CellFormatEnum.Number:
            return formatNumber(value, DEFAULT_NUMBER_FORMAT);
        case CellFormatEnum.Currency:
            return formatCurrency(value, AppConfig.defaultCurrency, DEFAULT_CURRENCY_FORMAT);
        case CellFormatEnum.Percentage:
            return formatPercentage(value, AppConfig.defaultDecimalPlaces);
        case CellFormatEnum.Scientific:
            return value.toExponential(2);
        default:
            return value.toString();
    }
}