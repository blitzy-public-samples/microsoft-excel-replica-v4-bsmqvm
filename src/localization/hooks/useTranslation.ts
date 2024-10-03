import React, { useContext } from 'react';
import { ILocalizationService } from '../interfaces/ILocalizationService';
import { LocalizationContext } from '../context/LocalizationContext';

/**
 * A custom React hook that provides access to translation and localization functions.
 * @returns An object with translation and localization functions.
 */
export const useTranslation = () => {
  const localizationService = useContext(LocalizationContext);

  if (!localizationService) {
    throw new Error('useTranslation must be used within a LocalizationProvider');
  }

  return {
    /**
     * Translates a given key using the translate method of the localization service.
     * @param key - The translation key.
     * @param params - Optional parameters for interpolation.
     * @returns The translated string.
     */
    t: (key: string, params?: Record<string, string>): string => {
      return localizationService.translate(key, params);
    },

    /**
     * Gets the current locale.
     * @returns The current locale string.
     */
    locale: localizationService.getLocale(),

    /**
     * Sets the current locale.
     * @param locale - The new locale to set.
     * @returns A promise that resolves when the locale has been set.
     */
    setLocale: async (locale: string): Promise<void> => {
      await localizationService.setLocale(locale);
    },

    /**
     * Formats a number according to the current locale.
     * @param value - The number to format.
     * @param options - Optional Intl.NumberFormatOptions.
     * @returns The formatted number string.
     */
    formatNumber: (value: number, options?: Intl.NumberFormatOptions): string => {
      return localizationService.formatNumber(value, options);
    },

    /**
     * Formats a date according to the current locale.
     * @param value - The date to format.
     * @param options - Optional Intl.DateTimeFormatOptions.
     * @returns The formatted date string.
     */
    formatDate: (value: Date, options?: Intl.DateTimeFormatOptions): string => {
      return localizationService.formatDate(value, options);
    },

    /**
     * Formats a currency value according to the current locale.
     * @param value - The currency value to format.
     * @param currency - The currency code (e.g., 'USD', 'EUR').
     * @param options - Optional Intl.NumberFormatOptions.
     * @returns The formatted currency string.
     */
    formatCurrency: (value: number, currency: string, options?: Intl.NumberFormatOptions): string => {
      return localizationService.formatCurrency(value, currency, options);
    },
  };
};