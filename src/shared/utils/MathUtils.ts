import Big from 'big.js';
import { MAX_DECIMAL_PLACES } from '../constants/AppConstants';

/**
 * This file contains utility functions for mathematical operations used throughout the Microsoft Excel application,
 * providing a centralized location for common mathematical calculations and transformations.
 */

/**
 * Rounds a number to a specified number of decimal places.
 * @param value The number to round.
 * @param decimals The number of decimal places to round to.
 * @returns The rounded number.
 */
export function round(value: number, decimals: number): number {
    // Check if decimals is within valid range
    if (decimals < 0 || decimals > MAX_DECIMAL_PLACES) {
        throw new Error(`Invalid number of decimal places. Must be between 0 and ${MAX_DECIMAL_PLACES}.`);
    }

    // Use Big.js to perform rounding with high precision
    return Number(new Big(value).round(decimals));
}

/**
 * Calculates the sum of an array of numbers.
 * @param numbers An array of numbers to sum.
 * @returns The sum of the numbers.
 */
export function sum(numbers: number[]): number {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Calculates the average (mean) of an array of numbers.
 * @param numbers An array of numbers to average.
 * @returns The average of the numbers.
 */
export function average(numbers: number[]): number {
    if (numbers.length === 0) {
        return 0;
    }
    return sum(numbers) / numbers.length;
}

/**
 * Calculates the median of an array of numbers.
 * @param numbers An array of numbers to find the median of.
 * @returns The median of the numbers.
 */
export function median(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

/**
 * Calculates the standard deviation of an array of numbers.
 * @param numbers An array of numbers to calculate the standard deviation of.
 * @returns The standard deviation of the numbers.
 */
export function standardDeviation(numbers: number[]): number {
    const avg = average(numbers);
    const squareDiffs = numbers.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

/**
 * Calculates the percentile of an array of numbers.
 * @param numbers An array of numbers to calculate the percentile from.
 * @param percentile The percentile to calculate (0-100).
 * @returns The percentile value.
 */
export function percentile(numbers: number[], percentile: number): number {
    if (percentile < 0 || percentile > 100) {
        throw new Error('Percentile must be between 0 and 100.');
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
        return sorted[lower];
    }

    const weightUpper = index - lower;
    return (1 - weightUpper) * sorted[lower] + weightUpper * sorted[upper];
}

/**
 * Calculates the factorial of a non-negative integer.
 * @param n The non-negative integer to calculate the factorial of.
 * @returns The factorial of n.
 */
export function factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) {
        throw new Error('Factorial is only defined for non-negative integers.');
    }

    if (n === 0 || n === 1) {
        return 1;
    }

    return n * factorial(n - 1);
}

/**
 * Calculates the greatest common divisor (GCD) of two numbers using the Euclidean algorithm.
 * @param a The first number.
 * @param b The second number.
 * @returns The greatest common divisor of a and b.
 */
export function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

/**
 * Calculates the least common multiple (LCM) of two numbers.
 * @param a The first number.
 * @param b The second number.
 * @returns The least common multiple of a and b.
 */
export function lcm(a: number, b: number): number {
    return Math.abs(a * b) / gcd(a, b);
}

/**
 * Checks if a number is prime.
 * @param n The number to check for primality.
 * @returns True if the number is prime, false otherwise.
 */
export function isPrime(n: number): boolean {
    if (n <= 1) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    const sqrt = Math.sqrt(n);
    for (let i = 3; i <= sqrt; i += 2) {
        if (n % i === 0) return false;
    }

    return true;
}