import { LocaleModel } from '../models/LocaleModel';
import { SupportedLanguages } from '../constants/SupportedLanguages';
import { SupportedRegions } from '../constants/SupportedRegions';
import { LocaleType, NumberFormatOptions, DateTimeFormatOptions, CurrencyFormatOptions } from '../types/LocalizationTypes';

/**
 * LocaleValidator class
 * Responsible for validating locale-related data in Microsoft Excel's localization system.
 */
export class LocaleValidator {
  /**
   * Validates if the given locale code is in the correct format and supported by the application.
   * @param localeCode - The locale code to validate
   * @returns Whether the locale code is valid
   */
  public static validateLocaleCode(localeCode: string): boolean {
    // Regex pattern for locale code format: xx-XX or xx-Xxxx-XX
    const localePattern = /^[a-z]{2}(-[A-Z]{2})?(-[A-Z][a-z]{3})?$/;
    return localePattern.test(localeCode);
  }

  /**
   * Checks if the given language is supported by the application.
   * @param language - The language code to validate
   * @returns Whether the language is supported
   */
  public static validateLanguage(language: string): boolean {
    return SupportedLanguages.includes(language);
  }

  /**
   * Checks if the given region is supported by the application.
   * @param region - The region code to validate
   * @returns Whether the region is supported
   */
  public static validateRegion(region: string): boolean {
    return SupportedRegions.includes(region);
  }

  /**
   * Validates the entire LocaleModel object for consistency and correctness.
   * @param localeModel - The LocaleModel object to validate
   * @returns Whether the LocaleModel is valid
   */
  public static validateLocaleModel(localeModel: LocaleModel): boolean {
    if (!this.validateLocaleCode(localeModel.code)) {
      return false;
    }

    if (!this.validateLanguage(localeModel.language)) {
      return false;
    }

    if (!this.validateRegion(localeModel.region)) {
      return false;
    }

    return (
      this.validateNumberFormat(localeModel.numberFormat) &&
      this.validateDateTimeFormat(localeModel.dateTimeFormat) &&
      this.validateCurrencyFormat(localeModel.currencyFormat)
    );
  }

  /**
   * Validates the number format options for a locale.
   * @param numberFormat - The number format options to validate
   * @returns Whether the number format options are valid
   */
  public static validateNumberFormat(numberFormat: NumberFormatOptions): boolean {
    // Implement validation logic for number format options
    // This is a simplified version and should be expanded based on specific requirements
    return (
      typeof numberFormat.decimalSeparator === 'string' &&
      typeof numberFormat.thousandsSeparator === 'string' &&
      typeof numberFormat.decimalPlaces === 'number' &&
      numberFormat.decimalPlaces >= 0
    );
  }

  /**
   * Validates the date and time format options for a locale.
   * @param dateTimeFormat - The date and time format options to validate
   * @returns Whether the date and time format options are valid
   */
  public static validateDateTimeFormat(dateTimeFormat: DateTimeFormatOptions): boolean {
    // Implement validation logic for date and time format options
    // This is a simplified version and should be expanded based on specific requirements
    return (
      typeof dateTimeFormat.dateFormat === 'string' &&
      typeof dateTimeFormat.timeFormat === 'string' &&
      typeof dateTimeFormat.firstDayOfWeek === 'number' &&
      dateTimeFormat.firstDayOfWeek >= 0 &&
      dateTimeFormat.firstDayOfWeek <= 6
    );
  }

  /**
   * Validates the currency format options for a locale.
   * @param currencyFormat - The currency format options to validate
   * @returns Whether the currency format options are valid
   */
  public static validateCurrencyFormat(currencyFormat: CurrencyFormatOptions): boolean {
    // Implement validation logic for currency format options
    // This is a simplified version and should be expanded based on specific requirements
    return (
      typeof currencyFormat.currencySymbol === 'string' &&
      typeof currencyFormat.currencyCode === 'string' &&
      typeof currencyFormat.symbolPosition === 'string' &&
      (currencyFormat.symbolPosition === 'before' || currencyFormat.symbolPosition === 'after')
    );
  }
}