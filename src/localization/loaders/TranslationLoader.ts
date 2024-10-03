import { TranslationModel } from '../models/TranslationModel';
import { SupportedLanguages } from '../constants/SupportedLanguages';
import { TranslationUtils } from '../utils/TranslationUtils';
import { LocalizationError } from '../errors/LocalizationError';

/**
 * TranslationLoader class is responsible for loading and managing translation data
 * for Microsoft Excel's localization system.
 */
export class TranslationLoader {
  private static instance: TranslationLoader;
  private translationCache: Map<string, TranslationModel>;

  /**
   * Private constructor to enforce singleton pattern.
   */
  private constructor() {
    this.translationCache = new Map<string, TranslationModel>();
  }

  /**
   * Returns the singleton instance of the TranslationLoader.
   * @returns {TranslationLoader} Singleton instance of TranslationLoader
   */
  public static getInstance(): TranslationLoader {
    if (!TranslationLoader.instance) {
      TranslationLoader.instance = new TranslationLoader();
    }
    return TranslationLoader.instance;
  }

  /**
   * Loads translations for the specified locale, either from cache or by fetching from the server.
   * @param {string} locale - The locale for which to load translations
   * @returns {Promise<TranslationModel>} Loaded translations for the specified locale
   * @throws {LocalizationError} If the locale is not supported or if there's an error loading translations
   */
  public async loadTranslations(locale: string): Promise<TranslationModel> {
    if (!SupportedLanguages.includes(locale)) {
      throw new LocalizationError(`Unsupported locale: ${locale}`);
    }

    if (this.translationCache.has(locale)) {
      return this.translationCache.get(locale)!;
    }

    try {
      const translations = await this.fetchTranslations(locale);
      this.translationCache.set(locale, translations);
      return translations;
    } catch (error) {
      throw new LocalizationError(`Error loading translations for locale ${locale}: ${error.message}`);
    }
  }

  /**
   * Fetches translations from the server for the specified locale.
   * @param {string} locale - The locale for which to fetch translations
   * @returns {Promise<TranslationModel>} Fetched translations for the specified locale
   * @throws {LocalizationError} If there's an error fetching translations from the server
   */
  private async fetchTranslations(locale: string): Promise<TranslationModel> {
    try {
      const response = await fetch(`/api/translations/${locale}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return TranslationUtils.validateAndNormalizeTranslations(data);
    } catch (error) {
      throw new LocalizationError(`Error fetching translations for locale ${locale}: ${error.message}`);
    }
  }

  /**
   * Clears the translation cache, useful for refreshing translations or freeing up memory.
   */
  public clearCache(): void {
    this.translationCache.clear();
  }
}

// Export a default instance of the TranslationLoader
export default TranslationLoader.getInstance();