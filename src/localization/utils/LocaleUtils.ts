import { SUPPORTED_LANGUAGES } from '../constants/SupportedLanguages';
import { SUPPORTED_REGIONS } from '../constants/SupportedRegions';
import { LocalizationError } from '../errors/LocalizationError';
import { Locale } from '../types/LocalizationTypes';

/**
 * Utility functions for handling locale-related operations in Microsoft Excel
 */
export class LocaleUtils {
  /**
   * Parses a locale string into its language and region components.
   * @param locale - The locale string to parse
   * @returns An object with language and region properties
   */
  static parseLocale(locale: string): Locale {
    const [language, region] = locale.split('-');
    return { language, region };
  }

  /**
   * Checks if a given locale string is valid according to the supported languages and regions.
   * @param locale - The locale string to validate
   * @returns Whether the locale is valid
   */
  static isValidLocale(locale: string): boolean {
    const { language, region } = this.parseLocale(locale);
    return SUPPORTED_LANGUAGES.includes(language) && SUPPORTED_REGIONS.includes(region);
  }

  /**
   * Normalizes a locale string to ensure consistent formatting.
   * @param locale - The locale string to normalize
   * @returns Normalized locale string
   */
  static getNormalizedLocale(locale: string): string {
    const { language, region } = this.parseLocale(locale);
    return `${language.toLowerCase()}-${region.toUpperCase()}`;
  }

  /**
   * Returns the default locale for the application.
   * @returns Default locale string
   */
  static getDefaultLocale(): string {
    // Assuming DEFAULT_LOCALE is defined in LocaleConstants
    return 'en-US'; // Replace with actual default locale
  }

  /**
   * Determines a fallback locale if the given locale is not supported.
   * @param locale - The locale string to find a fallback for
   * @returns Fallback locale string
   */
  static getFallbackLocale(locale: string): string {
    const { language } = this.parseLocale(locale);
    if (SUPPORTED_LANGUAGES.includes(language)) {
      return `${language}-${this.getDefaultRegionForLanguage(language)}`;
    }
    return this.getDefaultLocale();
  }

  /**
   * Determines the text direction (left-to-right or right-to-left) for a given locale.
   * @param locale - The locale string to determine text direction for
   * @returns 'ltr' for left-to-right or 'rtl' for right-to-left
   */
  static getLocaleDirection(locale: string): 'ltr' | 'rtl' {
    const { language } = this.parseLocale(locale);
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']; // Add more RTL languages as needed
    return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  }

  /**
   * Gets the default region for a given language.
   * @param language - The language code
   * @returns The default region code for the language
   * @private
   */
  private static getDefaultRegionForLanguage(language: string): string {
    // This is a simplified implementation. In a real-world scenario,
    // you might want to have a mapping of languages to their most common regions.
    const languageToRegion: { [key: string]: string } = {
      en: 'US',
      es: 'ES',
      fr: 'FR',
      // Add more mappings as needed
    };
    return languageToRegion[language] || 'US';
  }
}

// Human tasks:
// 1. Update the DEFAULT_LOCALE constant with the actual default locale for the application.
// 2. Implement a more comprehensive mapping of languages to their default regions in the getDefaultRegionForLanguage method.
// 3. Expand the list of RTL languages in the getLocaleDirection method if necessary.
// 4. Consider adding more utility functions as needed for locale-related operations specific to Microsoft Excel.