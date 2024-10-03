import { ILocalizationService } from '../interfaces/ILocalizationService';
import { LocaleModel } from '../models/LocaleModel';
import { TranslationModel } from '../models/TranslationModel';
import { LocalizationTypes } from '../types/LocalizationTypes';
import { LocaleUtils } from '../utils/LocaleUtils';
import { TranslationUtils } from '../utils/TranslationUtils';
import { LocalizationConfig } from '../config/LocalizationConfig';

export class LocalizationService implements ILocalizationService {
  private currentLocale: string;
  private translations: Map<string, TranslationModel>;

  constructor(config: LocalizationConfig) {
    this.currentLocale = config.defaultLocale || 'en-US';
    this.translations = new Map<string, TranslationModel>();
    this.loadTranslations(this.currentLocale);
  }

  async setLocale(locale: string): Promise<void> {
    this.currentLocale = locale;
    await this.loadTranslations(locale);
  }

  getLocale(): string {
    return this.currentLocale;
  }

  translate(key: string, params?: Record<string, string>): string {
    const translation = this.translations.get(key);
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }

    let translatedString = translation.value;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translatedString = translatedString.replace(`{{${paramKey}}}`, paramValue);
      });
    }

    return translatedString;
  }

  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.currentLocale, options).format(value);
  }

  formatDate(value: Date, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.currentLocale, options).format(value);
  }

  formatCurrency(value: number, currency: string, options?: Intl.NumberFormatOptions): string {
    const currencyOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency,
      ...options,
    };
    return this.formatNumber(value, currencyOptions);
  }

  private async loadTranslations(locale: string): Promise<void> {
    try {
      const translations = await TranslationUtils.fetchTranslations(locale);
      this.translations.clear();
      translations.forEach((translation) => {
        this.translations.set(translation.key, translation);
      });
    } catch (error) {
      console.error(`Failed to load translations for locale: ${locale}`, error);
      throw new Error(`Failed to load translations for locale: ${locale}`);
    }
  }
}