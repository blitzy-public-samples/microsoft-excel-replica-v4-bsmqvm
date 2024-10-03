import { LocaleConstants } from '../constants/LocaleConstants';
import { SupportedLanguages } from '../constants/SupportedLanguages';
import { SupportedRegions } from '../constants/SupportedRegions';
import { LocaleType, NumberFormatOptions, DateTimeFormatOptions, CurrencyFormatOptions } from '../types/LocalizationTypes';

/**
 * Interface defining the structure of a locale model in the application.
 */
export interface ILocaleModel {
  code: string;
  language: string;
  region: string;
  numberFormat: NumberFormatOptions;
  dateTimeFormat: DateTimeFormatOptions;
  currencyFormat: CurrencyFormatOptions;
}

/**
 * LocaleModel class implements the ILocaleModel interface and provides methods for working with locale data.
 */
export class LocaleModel implements ILocaleModel {
  public code: string;
  public language: string;
  public region: string;
  public numberFormat: NumberFormatOptions;
  public dateTimeFormat: DateTimeFormatOptions;
  public currencyFormat: CurrencyFormatOptions;

  constructor(
    code: string,
    language: string,
    region: string,
    numberFormat: NumberFormatOptions,
    dateTimeFormat: DateTimeFormatOptions,
    currencyFormat: CurrencyFormatOptions
  ) {
    this.code = code;
    this.language = language;
    this.region = region;
    this.numberFormat = numberFormat;
    this.dateTimeFormat = dateTimeFormat;
    this.currencyFormat = currencyFormat;
  }

  /**
   * Returns a human-readable display name for the locale.
   * @returns {string} Display name of the locale
   */
  public getDisplayName(): string {
    return `${this.language} (${this.region})`;
  }

  /**
   * Determines if the locale uses right-to-left text direction.
   * @returns {boolean} True if the locale uses right-to-left text direction, false otherwise
   */
  public isRTL(): boolean {
    // This is a simplified implementation. In a real-world scenario, you would
    // have a list of RTL languages to check against.
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(this.language);
  }

  /**
   * Formats a number according to the locale's number format settings.
   * @param {number} value - The number to format
   * @returns {string} Formatted number string
   */
  public formatNumber(value: number): string {
    return new Intl.NumberFormat(this.code, this.numberFormat).format(value);
  }

  /**
   * Formats a date according to the locale's date and time format settings.
   * @param {Date} date - The date to format
   * @returns {string} Formatted date string
   */
  public formatDate(date: Date): string {
    return new Intl.DateTimeFormat(this.code, this.dateTimeFormat).format(date);
  }

  /**
   * Formats a currency value according to the locale's currency format settings.
   * @param {number} value - The currency value to format
   * @returns {string} Formatted currency string
   */
  public formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.code, {
      ...this.numberFormat,
      ...this.currencyFormat,
      style: 'currency',
    }).format(value);
  }
}

/**
 * Factory function to create a LocaleModel instance
 * @param {LocaleType} localeData - The locale data to create the model from
 * @returns {LocaleModel} A new LocaleModel instance
 */
export function createLocaleModel(localeData: LocaleType): LocaleModel {
  return new LocaleModel(
    localeData.code,
    localeData.language,
    localeData.region,
    localeData.numberFormat,
    localeData.dateTimeFormat,
    localeData.currencyFormat
  );
}