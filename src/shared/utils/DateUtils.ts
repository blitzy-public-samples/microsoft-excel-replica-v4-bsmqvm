import { format, parse, differenceInDays, addDays } from 'date-fns';

// Assuming DEFAULT_DATE_FORMAT is defined elsewhere in the application
// import { DEFAULT_DATE_FORMAT } from '../constants/AppConstants';

/**
 * Utility functions for date and time operations used throughout the Microsoft Excel application.
 * This module provides a centralized location for common date manipulations and formatting.
 */

/**
 * Formats a Date object to a string using the specified format.
 * @param date The Date object to format
 * @param formatString The format string to use (default: DEFAULT_DATE_FORMAT)
 * @returns Formatted date string
 */
export function formatDate(date: Date, formatString: string = DEFAULT_DATE_FORMAT): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  return format(date, formatString);
}

/**
 * Parses a date string into a Date object using the specified format.
 * @param dateString The date string to parse
 * @param formatString The format string to use (default: DEFAULT_DATE_FORMAT)
 * @returns Parsed Date object
 */
export function parseDate(dateString: string, formatString: string = DEFAULT_DATE_FORMAT): Date {
  const parsedDate = parse(dateString, formatString, new Date());
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date string or format');
  }
  return parsedDate;
}

/**
 * Adds a specified number of days to a given date.
 * @param date The starting Date object
 * @param days The number of days to add (can be negative)
 * @returns New Date object with added days
 */
export function addDaysToDate(date: Date, days: number): Date {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  return addDays(date, days);
}

/**
 * Calculates the number of days between two dates.
 * @param startDate The start Date object
 * @param endDate The end Date object
 * @returns Number of days between the dates
 */
export function daysBetweenDates(startDate: Date, endDate: Date): number {
  if (!(startDate instanceof Date) || !(endDate instanceof Date) || 
      isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date(s) provided');
  }
  return Math.abs(differenceInDays(startDate, endDate));
}

/**
 * Determines if a given year is a leap year.
 * @param year The year to check
 * @returns True if the year is a leap year, false otherwise
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Returns the number of days in a given month of a specific year.
 * @param year The year
 * @param month The month (1-12)
 * @returns Number of days in the specified month
 */
export function getDaysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    throw new Error('Invalid month provided');
  }
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return daysInMonth[month - 1];
}

/**
 * Calculates the week number for a given date.
 * @param date The Date object
 * @returns Week number of the year
 */
export function getWeekNumber(date: Date): number {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}