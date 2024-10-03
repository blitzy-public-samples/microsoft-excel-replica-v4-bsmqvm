import { LocaleModel } from '../models/LocaleModel';
import { LocaleConstants } from '../constants/LocaleConstants';
import { SupportedLanguages } from '../constants/SupportedLanguages';
import { SupportedRegions } from '../constants/SupportedRegions';
import { ExternalLocaleFormat, LocalizationTypes } from '../types/LocalizationTypes';
import { LocalizationError } from '../errors/LocalizationError';
import { LocaleUtils } from '../utils/LocaleUtils';
import moment from 'moment';

/**
 * LocaleTransformer class
 * Responsible for transforming locale data between different formats used in the Excel localization system.
 */
export class LocaleTransformer {
  /**
   * Transforms an external locale format into the internal LocaleModel format used by the Excel localization system.
   * @param externalLocale The external locale format to transform
   * @returns The transformed internal LocaleModel
   * @throws LocalizationError if the transformation fails
   */
  public transformToInternalFormat(externalLocale: ExternalLocaleFormat): LocaleModel {
    try {
      const languageCode = this.normalizeLanguageCode(externalLocale.language);
      const regionCode = this.normalizeRegionCode(externalLocale.region);

      return new LocaleModel({
        language: languageCode,
        region: regionCode,
        dateFormat: externalLocale.dateFormat || LocaleConstants.DEFAULT_DATE_FORMAT,
        timeFormat: externalLocale.timeFormat || LocaleConstants.DEFAULT_TIME_FORMAT,
        numberFormat: externalLocale.numberFormat || LocaleConstants.DEFAULT_NUMBER_FORMAT,
        currencyCode: externalLocale.currencyCode || LocaleConstants.DEFAULT_CURRENCY_CODE,
        currencySymbol: externalLocale.currencySymbol || LocaleConstants.DEFAULT_CURRENCY_SYMBOL,
        firstDayOfWeek: externalLocale.firstDayOfWeek || LocaleConstants.DEFAULT_FIRST_DAY_OF_WEEK,
      });
    } catch (error) {
      throw new LocalizationError('Failed to transform external locale to internal format', error);
    }
  }

  /**
   * Transforms the internal LocaleModel format into an external locale format for interoperability with other systems or APIs.
   * @param internalLocale The internal LocaleModel to transform
   * @returns The transformed external locale format
   * @throws LocalizationError if the transformation fails
   */
  public transformToExternalFormat(internalLocale: LocaleModel): ExternalLocaleFormat {
    try {
      return {
        language: internalLocale.language,
        region: internalLocale.region,
        dateFormat: internalLocale.dateFormat,
        timeFormat: internalLocale.timeFormat,
        numberFormat: internalLocale.numberFormat,
        currencyCode: internalLocale.currencyCode,
        currencySymbol: internalLocale.currencySymbol,
        firstDayOfWeek: internalLocale.firstDayOfWeek,
      };
    } catch (error) {
      throw new LocalizationError('Failed to transform internal locale to external format', error);
    }
  }

  /**
   * Normalizes language codes to ensure consistency across the system.
   * @param languageCode The language code to normalize
   * @returns The normalized language code
   * @throws LocalizationError if the language code is invalid or unsupported
   */
  public normalizeLanguageCode(languageCode: string): string {
    const normalizedCode = languageCode.toLowerCase();
    if (!SupportedLanguages.includes(normalizedCode)) {
      throw new LocalizationError(`Unsupported language code: ${languageCode}`);
    }
    return normalizedCode;
  }

  /**
   * Normalizes region codes to ensure consistency across the system.
   * @param regionCode The region code to normalize
   * @returns The normalized region code
   * @throws LocalizationError if the region code is invalid or unsupported
   */
  public normalizeRegionCode(regionCode: string): string {
    const normalizedCode = regionCode.toUpperCase();
    if (!SupportedRegions.includes(normalizedCode)) {
      throw new LocalizationError(`Unsupported region code: ${regionCode}`);
    }
    return normalizedCode;
  }

  /**
   * Converts a locale string to a LocaleModel
   * @param localeString The locale string to convert (e.g., "en-US")
   * @returns The corresponding LocaleModel
   * @throws LocalizationError if the conversion fails
   */
  public localeStringToModel(localeString: string): LocaleModel {
    try {
      const [language, region] = localeString.split('-');
      return this.transformToInternalFormat({
        language: this.normalizeLanguageCode(language),
        region: this.normalizeRegionCode(region),
      });
    } catch (error) {
      throw new LocalizationError(`Failed to convert locale string to model: ${localeString}`, error);
    }
  }

  /**
   * Converts a LocaleModel to a locale string
   * @param localeModel The LocaleModel to convert
   * @returns The corresponding locale string (e.g., "en-US")
   */
  public modelToLocaleString(localeModel: LocaleModel): string {
    return `${localeModel.language}-${localeModel.region}`;
  }

  /**
   * Applies the locale settings to the moment.js library for consistent date and time formatting
   * @param localeModel The LocaleModel to apply
   */
  public applyLocaleToMoment(localeModel: LocaleModel): void {
    const localeString = this.modelToLocaleString(localeModel);
    moment.locale(localeString, {
      week: {
        dow: localeModel.firstDayOfWeek,
      },
    });
  }
}

export default LocaleTransformer;