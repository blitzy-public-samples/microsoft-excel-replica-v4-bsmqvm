import { LocaleModel } from '../models/LocaleModel';
import { LocaleConstants } from '../constants/LocaleConstants';
import { SupportedLanguages } from '../constants/SupportedLanguages';
import { SupportedRegions } from '../constants/SupportedRegions';
import { LocaleUtils } from '../utils/LocaleUtils';
import { LocaleValidator } from '../validators/LocaleValidator';

export class LocaleFactory {
  /**
   * Creates a new Locale instance based on the provided language and region.
   * @param language The language code
   * @param region The region code
   * @returns A new LocaleModel instance
   */
  static createLocale(language: string, region: string): LocaleModel {
    // Validate the input language and region
    if (!LocaleValidator.isValidLanguage(language) || !LocaleValidator.isValidRegion(region)) {
      throw new Error('Invalid language or region');
    }

    // Normalize the locale string
    const normalizedLocale = LocaleUtils.normalizeLocale(language, region);

    // Create a new LocaleModel instance
    const locale = new LocaleModel(normalizedLocale);

    // Set default number, date/time, and currency formats based on the locale
    locale.setNumberFormat(LocaleUtils.getDefaultNumberFormat(normalizedLocale));
    locale.setDateTimeFormat(LocaleUtils.getDefaultDateTimeFormat(normalizedLocale));
    locale.setCurrencyFormat(LocaleUtils.getDefaultCurrencyFormat(normalizedLocale));

    return locale;
  }

  /**
   * Returns the default Locale instance.
   * @returns The default LocaleModel instance
   */
  static getDefaultLocale(): LocaleModel {
    const [defaultLanguage, defaultRegion] = LocaleConstants.DEFAULT_LOCALE.split('-');
    return this.createLocale(defaultLanguage, defaultRegion);
  }

  /**
   * Returns an array of all supported Locale instances.
   * @returns An array of supported LocaleModel instances
   */
  static getSupportedLocales(): LocaleModel[] {
    const supportedLocales: LocaleModel[] = [];

    for (const language of SupportedLanguages) {
      for (const region of SupportedRegions) {
        if (this.isLocaleSupported(language, region)) {
          supportedLocales.push(this.createLocale(language, region));
        }
      }
    }

    return supportedLocales;
  }

  /**
   * Checks if a given language and region combination is supported.
   * @param language The language code
   * @param region The region code
   * @returns True if the locale is supported, false otherwise
   */
  static isLocaleSupported(language: string, region: string): boolean {
    return LocaleValidator.isValidLanguage(language) && LocaleValidator.isValidRegion(region);
  }
}