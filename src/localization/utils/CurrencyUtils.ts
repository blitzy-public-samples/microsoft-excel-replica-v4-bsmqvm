import { LocaleConstants } from '../constants/LocaleConstants';
import { LocalizationTypes } from '../types/LocalizationTypes';
import { LocalizationError } from '../errors/LocalizationError';
import { LocaleUtils } from './LocaleUtils';

/**
 * Utility functions for handling currency-related operations in Microsoft Excel.
 */
export class CurrencyUtils {
  /**
   * Formats a numeric amount as a localized currency string.
   * @param amount The numeric amount to format.
   * @param locale The locale to use for formatting.
   * @param currency The currency code to use.
   * @returns Formatted currency string.
   */
  static formatCurrency(amount: number, locale: string, currency: string): string {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
      });
      return formatter.format(amount);
    } catch (error) {
      throw new LocalizationError(`Error formatting currency: ${error.message}`);
    }
  }

  /**
   * Parses a localized currency string into a numeric value.
   * @param currencyString The currency string to parse.
   * @param locale The locale of the currency string.
   * @returns Parsed numeric value.
   */
  static parseCurrency(currencyString: string, locale: string): number {
    try {
      // Remove currency symbols and non-numeric characters
      const cleanedString = currencyString.replace(/[^\d.,\-]/g, '');
      const decimalSeparator = LocaleUtils.getDecimalSeparator(locale);
      const normalizedString = cleanedString.replace(decimalSeparator, '.');
      return parseFloat(normalizedString);
    } catch (error) {
      throw new LocalizationError(`Error parsing currency: ${error.message}`);
    }
  }

  /**
   * Retrieves the currency symbol for a given currency code and locale.
   * @param currency The currency code.
   * @param locale The locale to use.
   * @returns Currency symbol.
   */
  static getCurrencySymbol(currency: string, locale: string): string {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
      });
      const parts = formatter.formatToParts(0);
      const symbolPart = parts.find(part => part.type === 'currency');
      return symbolPart ? symbolPart.value : currency;
    } catch (error) {
      throw new LocalizationError(`Error getting currency symbol: ${error.message}`);
    }
  }

  /**
   * Converts an amount from one currency to another using provided exchange rates.
   * @param amount The amount to convert.
   * @param fromCurrency The source currency code.
   * @param toCurrency The target currency code.
   * @param exchangeRates An object containing exchange rates.
   * @returns Converted amount.
   */
  static convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    exchangeRates: Record<string, number>
  ): number {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      throw new LocalizationError('Exchange rates not available for the specified currencies');
    }

    const conversionRate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    return amount * conversionRate;
  }

  /**
   * Determines the default currency for a given locale.
   * @param locale The locale to use.
   * @returns Default currency code.
   */
  static getDefaultCurrency(locale: string): string {
    try {
      const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
      const parts = formatter.formatToParts(0);
      const currencyPart = parts.find(part => part.type === 'currency');
      return currencyPart ? currencyPart.value : 'USD';
    } catch (error) {
      console.warn(`Error determining default currency for locale ${locale}: ${error.message}`);
      return 'USD';
    }
  }
}

// Human tasks:
// 1. Implement proper error handling and logging for each function.
// 2. Add unit tests for each function in the CurrencyUtils class.
// 3. Optimize the performance of currency conversion for large datasets.
// 4. Implement caching mechanism for frequently used currency symbols and exchange rates.
// 5. Add support for custom currency formats based on user preferences.