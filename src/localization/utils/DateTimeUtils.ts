import { ILocalizationService } from '../interfaces/ILocalizationService';
import { LocaleUtils } from './LocaleUtils';
import { LocaleConstants } from '../constants/LocaleConstants';
import { LocaleInfo } from '../types/LocalizationTypes';
import moment from 'moment';

export class DateTimeUtils {
  private static localizationService: ILocalizationService;

  public static setLocalizationService(service: ILocalizationService) {
    DateTimeUtils.localizationService = service;
  }

  /**
   * Formats a date according to the specified format and locale.
   * @param date The date to format
   * @param format The format string
   * @param locale The locale to use for formatting
   * @returns The formatted date string
   */
  public static formatDate(date: Date, format: string, locale: string): string {
    moment.locale(locale);
    return moment(date).format(format);
  }

  /**
   * Parses a date string according to the specified format and locale.
   * @param dateString The date string to parse
   * @param format The format of the date string
   * @param locale The locale to use for parsing
   * @returns The parsed Date object
   */
  public static parseDate(dateString: string, format: string, locale: string): Date {
    moment.locale(locale);
    return moment(dateString, format).toDate();
  }

  /**
   * Returns an array of localized month names.
   * @param locale The locale to use
   * @param format The format of the month names ('long', 'short', or 'narrow')
   * @returns Array of localized month names
   */
  public static getLocalizedMonthNames(locale: string, format: 'long' | 'short' | 'narrow'): string[] {
    const localeInfo: LocaleInfo = LocaleUtils.getLocaleInfo(locale);
    const options: Intl.DateTimeFormatOptions = { month: format };
    const formatter = new Intl.DateTimeFormat(localeInfo.code, options);
    
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2021, i, 1);
      return formatter.format(date);
    });
  }

  /**
   * Returns an array of localized day names.
   * @param locale The locale to use
   * @param format The format of the day names ('long', 'short', or 'narrow')
   * @returns Array of localized day names
   */
  public static getLocalizedDayNames(locale: string, format: 'long' | 'short' | 'narrow'): string[] {
    const localeInfo: LocaleInfo = LocaleUtils.getLocaleInfo(locale);
    const options: Intl.DateTimeFormatOptions = { weekday: format };
    const formatter = new Intl.DateTimeFormat(localeInfo.code, options);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2021, 0, i + 3); // January 3, 2021 is a Sunday
      return formatter.format(date);
    });
  }

  /**
   * Checks if a given date is valid.
   * @param date The date to check
   * @returns Whether the date is valid
   */
  public static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Returns the index of the first day of the week for a given locale.
   * @param locale The locale to use
   * @returns Index of the first day of the week (0 for Sunday, 1 for Monday, etc.)
   */
  public static getFirstDayOfWeek(locale: string): number {
    const localeInfo: LocaleInfo = LocaleUtils.getLocaleInfo(locale);
    return localeInfo.firstDayOfWeek;
  }

  /**
   * Formats a date range according to the specified locale.
   * @param startDate The start date of the range
   * @param endDate The end date of the range
   * @param locale The locale to use for formatting
   * @returns The formatted date range string
   */
  public static formatDateRange(startDate: Date, endDate: Date, locale: string): string {
    const localeInfo: LocaleInfo = LocaleUtils.getLocaleInfo(locale);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formatter = new Intl.DateTimeFormat(localeInfo.code, options);
    return formatter.formatRange(startDate, endDate);
  }

  /**
   * Converts a date to ISO 8601 format.
   * @param date The date to convert
   * @returns The date in ISO 8601 format
   */
  public static toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parses an ISO 8601 formatted date string.
   * @param isoString The ISO 8601 formatted date string
   * @returns The parsed Date object
   */
  public static fromISOString(isoString: string): Date {
    return new Date(isoString);
  }
}

// Initialize moment with all locales
moment.locale(LocaleConstants.SUPPORTED_LOCALES);