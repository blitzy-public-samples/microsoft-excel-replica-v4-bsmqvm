import { ChartType, ChartOptions } from '../types/chart-types';
import { getContrastColor } from './color-utils';
import { roundToSignificantDigits } from './math-utils';
import { format } from 'date-fns';
import numeral from 'numeral';

/**
 * Formats a number for display in charts, taking into account locale and specified options.
 * @param value The number to format
 * @param options Formatting options
 * @returns Formatted number string
 */
export function formatNumber(value: number, options?: NumberFormatOptions): string {
  const defaultOptions: NumberFormatOptions = {
    locale: 'en-US',
    precision: 2,
    format: '0,0.[00]'
  };

  const mergedOptions = { ...defaultOptions, ...options };
  
  // Use numeral library to format the number based on options
  numeral.locale(mergedOptions.locale);
  return numeral(value).format(mergedOptions.format);
}

/**
 * Formats a date for display in charts, using the specified format string.
 * @param date The date to format
 * @param formatString The format string to use
 * @returns Formatted date string
 */
export function formatDate(date: Date, formatString: string): string {
  return format(date, formatString);
}

/**
 * Formats a value for display as an axis label, taking into account the axis type and chart type.
 * @param value The value to format
 * @param axisType The type of axis ('x' or 'y')
 * @param chartType The type of chart
 * @param options Formatting options
 * @returns Formatted axis label
 */
export function formatAxisLabel(
  value: number | Date,
  axisType: 'x' | 'y',
  chartType: ChartType,
  options?: AxisLabelFormatOptions
): string {
  const isDate = value instanceof Date;

  if (isDate) {
    const dateFormat = options?.dateFormat || 'MMM dd, yyyy';
    return formatDate(value, dateFormat);
  } else {
    const numberFormat = options?.numberFormat || '0,0.[00]';
    return formatNumber(value, { format: numberFormat });
  }
}

/**
 * Formats a value for display in a chart tooltip, considering the chart type and specified options.
 * @param value The value to format
 * @param chartType The type of chart
 * @param options Formatting options
 * @returns Formatted tooltip content
 */
export function formatTooltip(
  value: number | Date,
  chartType: ChartType,
  options?: TooltipFormatOptions
): string {
  const isDate = value instanceof Date;

  if (isDate) {
    const dateFormat = options?.dateFormat || 'MMM dd, yyyy HH:mm:ss';
    return formatDate(value, dateFormat);
  } else {
    const numberFormat = options?.numberFormat || '0,0.[0000]';
    return formatNumber(value, { format: numberFormat });
  }
}

/**
 * Truncates a label to a specified maximum length, adding an ellipsis if necessary.
 * @param label The label to truncate
 * @param maxLength The maximum length of the label
 * @returns Truncated label
 */
export function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) {
    return label;
  }
  return label.slice(0, maxLength - 3) + '...';
}

// Type definitions for options (these would typically be in a separate types file)
interface NumberFormatOptions {
  locale?: string;
  precision?: number;
  format?: string;
}

interface AxisLabelFormatOptions {
  dateFormat?: string;
  numberFormat?: string;
}

interface TooltipFormatOptions {
  dateFormat?: string;
  numberFormat?: string;
}