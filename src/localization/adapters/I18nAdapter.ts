import { ILocalizationService } from '../interfaces/ILocalizationService';
import { LocaleModel } from '../models/LocaleModel';
import { TranslationModel } from '../models/TranslationModel';
import { LocalizationTypes } from '../types/LocalizationTypes';
import { LocaleUtils } from '../utils/LocaleUtils';
import i18next from 'i18next';

export class I18nAdapter implements ILocalizationService {
    private i18n: i18next.i18n;

    constructor(i18nInstance: i18next.i18n) {
        this.i18n = i18nInstance;
    }

    async setLocale(locale: string): Promise<void> {
        await this.i18n.changeLanguage(locale);
    }

    getLocale(): string {
        return this.i18n.language;
    }

    translate(key: string, params?: Record<string, string>): string {
        return this.i18n.t(key, params);
    }

    formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
        const locale = this.getLocale();
        return new Intl.NumberFormat(locale, options).format(value);
    }

    formatDate(value: Date, options?: Intl.DateTimeFormatOptions): string {
        const locale = this.getLocale();
        return new Intl.DateTimeFormat(locale, options).format(value);
    }

    formatCurrency(value: number, currency: string, options?: Intl.NumberFormatOptions): string {
        const locale = this.getLocale();
        const currencyOptions: Intl.NumberFormatOptions = {
            ...options,
            style: 'currency',
            currency: currency,
        };
        return new Intl.NumberFormat(locale, currencyOptions).format(value);
    }

    // Additional methods to implement ILocalizationService interface
    // These methods are not specified in the JSON but are likely needed for the interface

    async loadTranslations(translations: TranslationModel[]): Promise<void> {
        // Implementation for loading translations into i18next
        const resources = translations.reduce((acc, translation) => {
            acc[translation.locale] = { translation: translation.translations };
            return acc;
        }, {} as Record<string, { translation: Record<string, string> }>);

        await this.i18n.init({
            resources,
            lng: this.getLocale(),
            fallbackLng: 'en',
        });
    }

    getAvailableLocales(): LocaleModel[] {
        // Implementation to return available locales
        // This would typically come from a configuration or the loaded resources
        return Object.keys(this.i18n.services.resourceStore.data).map(locale => ({
            code: locale,
            name: LocaleUtils.getLocaleName(locale),
        }));
    }

    getSupportedDateFormats(): LocalizationTypes.DateFormat[] {
        // Implementation to return supported date formats
        // This could be a predefined list or dynamically generated based on the current locale
        return [
            'short',
            'medium',
            'long',
            'full',
        ];
    }

    getSupportedNumberFormats(): LocalizationTypes.NumberFormat[] {
        // Implementation to return supported number formats
        // This could be a predefined list or dynamically generated based on the current locale
        return [
            'decimal',
            'percent',
            'currency',
        ];
    }
}