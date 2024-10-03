import { LocaleModel } from '../models/LocaleModel';
import { TranslationModel } from '../models/TranslationModel';
import * as LocalizationTypes from '../types/LocalizationTypes';

/**
 * This interface defines the contract for the localization service in Microsoft Excel.
 * It provides methods for setting and retrieving locales, translating text, and formatting
 * numbers, dates, and currencies according to the current locale.
 */
export interface ILocalizationService {
  /**
   * Sets the current locale for the application.
   * @param locale - The locale code to set (e.g., 'en-US', 'fr-FR')
   * @returns A promise that resolves when the locale is set
   */
  setLocale(locale: string): Promise<void>;

  /**
   * Retrieves the current locale of the application.
   * @returns The current locale code as a string
   */
  getLocale(): string;

  /**
   * Translates a given key into the current locale, with optional parameter substitution.
   * @param key - The translation key to look up
   * @param params - Optional parameters for substitution in the translated string
   * @returns The translated string
   */
  translate(key: string, params?: Record<string, string>): string;

  /**
   * Formats a number according to the current locale and provided options.
   * @param value - The number to format
   * @param options - Optional formatting options
   * @returns The formatted number string
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string;

  /**
   * Formats a date according to the current locale and provided options.
   * @param value - The date to format
   * @param options - Optional formatting options
   * @returns The formatted date string
   */
  formatDate(value: Date, options?: Intl.DateTimeFormatOptions): string;

  /**
   * Formats a currency value according to the current locale and provided options.
   * @param value - The currency value to format
   * @param currency - The currency code (e.g., 'USD', 'EUR')
   * @param options - Optional formatting options
   * @returns The formatted currency string
   */
  formatCurrency(value: number, currency: string, options?: Intl.NumberFormatOptions): string;
}