/**
 * This file defines the TypeScript types and interfaces used throughout the localization module of Microsoft Excel.
 * It provides a structured way to represent localization-related data and ensures type safety across the application.
 */

// Import locale-related constant values (assuming they exist in these files)
import { LocaleConstants } from '../constants/LocaleConstants';
import { SupportedLanguages } from '../constants/SupportedLanguages';
import { SupportedRegions } from '../constants/SupportedRegions';

/**
 * Represents a locale string.
 */
export type Locale = string;

/**
 * Represents a language string.
 */
export type Language = string;

/**
 * Represents a region string.
 */
export type Region = string;

/**
 * Represents a translation key.
 */
export type TranslationKey = string;

/**
 * Represents a translation value.
 */
export type TranslationValue = string;

/**
 * Represents a dictionary of translations for a specific locale.
 */
export interface TranslationDictionary {
  [key: TranslationKey]: TranslationValue;
}

/**
 * Represents all localization data for a specific locale.
 */
export interface LocaleData {
  locale: Locale;
  language: Language;
  region: Region;
  translations: TranslationDictionary;
  numberFormat: NumberFormatOptions;
  dateTimeFormat: DateTimeFormatOptions;
  currencyFormat: CurrencyFormatOptions;
}

/**
 * Defines options for number formatting in a specific locale.
 */
export interface NumberFormatOptions {
  decimalSeparator: string;
  thousandsSeparator: string;
  currencySymbol: string;
  currencySymbolPosition: 'before' | 'after';
}

/**
 * Defines options for date and time formatting in a specific locale.
 */
export interface DateTimeFormatOptions {
  dateFormat: string;
  timeFormat: string;
  firstDayOfWeek: number;
}

/**
 * Defines options for currency formatting in a specific locale.
 */
export interface CurrencyFormatOptions {
  symbol: string;
  code: string;
  decimalPlaces: number;
}

/**
 * Represents the configuration for the localization system.
 */
export interface LocalizationConfig {
  defaultLocale: Locale;
  supportedLocales: Locale[];
  fallbackLocale: Locale;
}

/**
 * Represents an error that can occur during localization operations.
 */
export class LocalizationError extends Error {
  constructor(public code: string, public params: Record<string, unknown>) {
    super(`Localization Error: ${code}`);
    this.name = 'LocalizationError';
  }
}

// Export the imported constants to make them available to other modules
export { LocaleConstants, SupportedLanguages, SupportedRegions };