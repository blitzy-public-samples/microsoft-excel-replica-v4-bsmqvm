import { ILocalizationService } from '../interfaces/ILocalizationService';
import { TranslationModel } from '../models/TranslationModel';
import { SupportedLanguages } from '../constants/SupportedLanguages';
import { TranslationUtils } from '../utils/TranslationUtils';
import { LocalizationError } from '../errors/LocalizationError';

export class TranslationService implements ILocalizationService {
  private translations: Map<string, TranslationModel> = new Map();
  private currentLocale: string = 'en-US'; // Default locale

  constructor() {
    // Initialize default translations and set default locale
    this.initializeDefaultTranslations();
  }

  private initializeDefaultTranslations(): void {
    // TODO: Load default translations from a file or API
    const defaultTranslations: TranslationModel = {
      locale: 'en-US',
      translations: {
        'common.ok': 'OK',
        'common.cancel': 'Cancel',
        // Add more default translations as needed
      }
    };
    this.translations.set('en-US', defaultTranslations);
  }

  public async setLocale(locale: string): Promise<void> {
    if (!SupportedLanguages.includes(locale)) {
      throw new LocalizationError(`Unsupported locale: ${locale}`);
    }

    this.currentLocale = locale;
    await this.loadTranslations(locale);
  }

  public getLocale(): string {
    return this.currentLocale;
  }

  public translate(key: string, params?: Record<string, string>): string {
    const translationModel = this.translations.get(this.currentLocale);
    if (!translationModel) {
      throw new LocalizationError(`Translations not loaded for locale: ${this.currentLocale}`);
    }

    const translation = translationModel.translations[key];
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key; // Return the key itself if translation is not found
    }

    return params ? this.interpolateParams(translation, params) : translation;
  }

  private async loadTranslations(locale: string): Promise<void> {
    try {
      // TODO: Implement actual translation loading logic
      // This could involve fetching translations from an API or loading from a file
      const loadedTranslations: TranslationModel = await this.fetchTranslations(locale);
      this.translations.set(locale, loadedTranslations);
    } catch (error) {
      throw new LocalizationError(`Failed to load translations for locale: ${locale}`, error);
    }
  }

  private async fetchTranslations(locale: string): Promise<TranslationModel> {
    // TODO: Implement actual fetching logic
    // This is a placeholder implementation
    return {
      locale,
      translations: {
        'common.ok': locale === 'es-ES' ? 'Aceptar' : 'OK',
        'common.cancel': locale === 'es-ES' ? 'Cancelar' : 'Cancel',
        // Add more translations as needed
      }
    };
  }

  private interpolateParams(text: string, params: Record<string, string>): string {
    return TranslationUtils.interpolateParams(text, params);
  }
}

// Human tasks:
// 1. Implement the actual translation loading logic in the loadTranslations method.
// 2. Implement the fetchTranslations method to retrieve translations from a backend API or file system.
// 3. Add more default translations in the initializeDefaultTranslations method.
// 4. Implement caching mechanism for loaded translations to improve performance.
// 5. Add unit tests for the TranslationService class.