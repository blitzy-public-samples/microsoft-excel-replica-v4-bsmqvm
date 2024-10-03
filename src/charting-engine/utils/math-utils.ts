import { ChartDataPoint } from '../types/chart-types';
import * as mathjs from 'mathjs';

/**
 * Calculates the arithmetic mean of an array of numbers.
 * @param values An array of numbers
 * @returns The arithmetic mean of the input values
 */
export function calculateMean(values: number[]): number {
    if (values.length === 0) {
        throw new Error('Cannot calculate mean of an empty array');
    }
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

/**
 * Calculates the median of an array of numbers.
 * @param values An array of numbers
 * @returns The median of the input values
 */
export function calculateMedian(values: number[]): number {
    if (values.length === 0) {
        throw new Error('Cannot calculate median of an empty array');
    }
    const sortedValues = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sortedValues.length / 2);
    return sortedValues.length % 2 !== 0 ? sortedValues[mid] : (sortedValues[mid - 1] + sortedValues[mid]) / 2;
}

/**
 * Calculates the standard deviation of an array of numbers.
 * @param values An array of numbers
 * @returns The standard deviation of the input values
 */
export function calculateStandardDeviation(values: number[]): number {
    if (values.length < 2) {
        throw new Error('Cannot calculate standard deviation with less than two values');
    }
    const mean = calculateMean(values);
    const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
    const variance = calculateMean(squaredDifferences);
    return Math.sqrt(variance);
}

/**
 * Performs linear regression on a set of data points and returns the slope and intercept.
 * @param points An array of ChartDataPoint objects
 * @returns An object containing the slope and intercept of the linear regression line
 */
export function linearRegression(points: ChartDataPoint[]): { slope: number; intercept: number } {
    if (points.length < 2) {
        throw new Error('Cannot perform linear regression with less than two points');
    }

    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    for (const point of points) {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumXX += point.x * point.x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

/**
 * Rounds a number to a specified number of significant digits.
 * @param value The number to round
 * @param digits The number of significant digits to round to
 * @returns The rounded value
 */
export function roundToSignificantDigits(value: number, digits: number): number {
    if (digits <= 0) {
        throw new Error('Number of significant digits must be greater than zero');
    }
    return Number(mathjs.format(value, { notation: 'fixed', precision: digits }));
}

/**
 * Interpolates between two colors based on a factor.
 * @param color1 The starting color in hexadecimal format
 * @param color2 The ending color in hexadecimal format
 * @param factor A number between 0 and 1 representing the interpolation factor
 * @returns The interpolated color in hexadecimal format
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
    if (factor < 0 || factor > 1) {
        throw new Error('Interpolation factor must be between 0 and 1');
    }

    const hex = (color: string) => parseInt(color.slice(1), 16);
    const r1 = hex(color1) >> 16;
    const g1 = (hex(color1) >> 8) & 0xff;
    const b1 = hex(color1) & 0xff;
    const r2 = hex(color2) >> 16;
    const g2 = (hex(color2) >> 8) & 0xff;
    const b2 = hex(color2) & 0xff;

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}