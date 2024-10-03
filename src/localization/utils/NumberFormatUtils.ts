import { LocaleUtils } from '../utils/LocaleUtils';
import { LocaleConstants } from '../constants/LocaleConstants';
import { LocalizationTypes } from '../types/LocalizationTypes';
import { LocalizationError } from '../errors/LocalizationError';
import { NumeralAdapter } from '../adapters/NumeralAdapter';

/**
 * Utility functions for formatting numbers according to different locales in Microsoft Excel,
 * providing consistent number representation across various languages and regions.
 */
export class NumberFormatUtils {
  private static numeralAdapter: NumeralAdapter = new NumeralAdapter();

  /**
   * Formats a number according to the specified locale and options.
   * @param value The number to format
   * @param locale The locale to use for formatting
   * @param options Additional formatting options
   * @returns Formatted number string
   */
  public static formatNumber(
    value: number,
    locale: string,
    options: LocalizationTypes.NumberFormatOptions = {}
  ): string {
    try {
      this.numeralAdapter.setLocale(locale);
      const format = this.getFormatString(options);
      return this.numeralAdapter.format(value, format);
    } catch (error) {
      throw new LocalizationError('Error formatting number', { value, locale, options }, error);
    }
  }

  /**
   * Parses a localized number string into a JavaScript number.
   * @param value The string representation of the number
   * @param locale The locale of the number string
   * @returns Parsed number value
   */
  public static parseNumber(value: string, locale: string): number {
    try {
      this.numeralAdapter.setLocale(locale);
      return this.numeralAdapter.parse(value);
    } catch (error) {
      throw new LocalizationError('Error parsing number', { value, locale }, error);
    }
  }

  /**
   * Returns the decimal separator for the specified locale.
   * @param locale The locale to get the decimal separator for
   * @returns Decimal separator character
   */
  public static getDecimalSeparator(locale: string): string {
    return LocaleUtils.getLocaleInfo(locale).decimalSeparator;
  }

  /**
   * Returns the thousands separator for the specified locale.
   * @param locale The locale to get the thousands separator for
   * @returns Thousands separator character
   */
  public static getThousandsSeparator(locale: string): string {
    return LocaleUtils.getLocaleInfo(locale).thousandsSeparator;
  }

  /**
   * Formats a number as a percentage for the specified locale.
   * @param value The number to format as a percentage
   * @param locale The locale to use for formatting
   * @param decimalPlaces The number of decimal places to show
   * @returns Formatted percentage string
   */
  public static formatPercentage(value: number, locale: string, decimalPlaces: number = 2): string {
    const options: LocalizationTypes.NumberFormatOptions = {
      style: 'percent',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    };
    return this.formatNumber(value, locale, options);
  }

  /**
   * Formats a number as currency for the specified locale and currency code.
   * @param value The number to format as currency
   * @param locale The locale to use for formatting
   * @param currencyCode The ISO 4217 currency code
   * @returns Formatted currency string
   */
  public static formatCurrency(value: number, locale: string, currencyCode: string): string {
    const options: LocalizationTypes.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
    };
    return this.formatNumber(value, locale, options);
  }

  private static getFormatString(options: LocalizationTypes.NumberFormatOptions): string {
    let format = '0,0';

    if (options.minimumFractionDigits || options.maximumFractionDigits) {
      const fractionDigits = options.minimumFractionDigits || options.maximumFractionDigits || 0;
      format += '.' + '0'.repeat(fractionDigits);
    }

    if (options.style === 'percent') {
      format += '%';
    } else if (options.style === 'currency') {
      format = '$' + format;
    }

    return format;
  }
}