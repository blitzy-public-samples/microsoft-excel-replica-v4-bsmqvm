import { ILocalizationService } from '../interfaces/ILocalizationService';
import { LocaleModel } from '../models/LocaleModel';
import { LocaleConstants } from '../constants/LocaleConstants';
import { SupportedLanguages } from '../constants/SupportedLanguages';
import { SupportedRegions } from '../constants/SupportedRegions';
import { LocalizationTypes } from '../types/LocalizationTypes';
import { LocaleUtils } from '../utils/LocaleUtils';
import { CurrencyUtils } from '../utils/CurrencyUtils';
import { DateTimeUtils } from '../utils/DateTimeUtils';
import { NumberFormatUtils } from '../utils/NumberFormatUtils';

export class LocaleFormattingService implements ILocalizationService {
    private currentLocale: LocaleModel;

    constructor(initialLocale: LocaleModel) {
        this.currentLocale = initialLocale;
    }

    setLocale(locale: LocaleModel): void {
        this.currentLocale = locale;
    }

    formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
        return NumberFormatUtils.formatNumber(value, this.currentLocale, options);
    }

    formatCurrency(value: number, currencyCode: string, options?: Intl.NumberFormatOptions): string {
        return CurrencyUtils.formatCurrency(value, currencyCode, this.currentLocale, options);
    }

    formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
        return DateTimeUtils.formatDate(date, this.currentLocale, options);
    }

    formatTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
        return DateTimeUtils.formatTime(date, this.currentLocale, options);
    }

    getLocalizedDayNames(style: 'long' | 'short' | 'narrow'): string[] {
        return DateTimeUtils.getLocalizedDayNames(this.currentLocale, style);
    }

    getLocalizedMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        return DateTimeUtils.getLocalizedMonthNames(this.currentLocale, style);
    }

    // Additional methods to support Excel-specific formatting requirements

    formatPercentage(value: number, options?: Intl.NumberFormatOptions): string {
        const defaultOptions: Intl.NumberFormatOptions = { style: 'percent', ...options };
        return this.formatNumber(value, defaultOptions);
    }

    formatScientific(value: number, options?: Intl.NumberFormatOptions): string {
        const defaultOptions: Intl.NumberFormatOptions = { notation: 'scientific', ...options };
        return this.formatNumber(value, defaultOptions);
    }

    formatFraction(value: number, denominator: number): string {
        return NumberFormatUtils.formatFraction(value, denominator, this.currentLocale);
    }

    formatAccountingStyle(value: number, currencyCode: string, options?: Intl.NumberFormatOptions): string {
        const defaultOptions: Intl.NumberFormatOptions = { 
            style: 'currency', 
            currencySign: 'accounting',
            ...options
        };
        return this.formatCurrency(value, currencyCode, defaultOptions);
    }

    formatCustomNumberFormat(value: number, format: string): string {
        return NumberFormatUtils.formatCustom(value, format, this.currentLocale);
    }

    parseNumber(value: string): number | null {
        return NumberFormatUtils.parseNumber(value, this.currentLocale);
    }

    parseDate(value: string): Date | null {
        return DateTimeUtils.parseDate(value, this.currentLocale);
    }

    getDecimalSeparator(): string {
        return LocaleUtils.getDecimalSeparator(this.currentLocale);
    }

    getThousandsSeparator(): string {
        return LocaleUtils.getThousandsSeparator(this.currentLocale);
    }

    getCurrencySymbol(currencyCode: string): string {
        return CurrencyUtils.getCurrencySymbol(currencyCode, this.currentLocale);
    }

    isRTL(): boolean {
        return LocaleUtils.isRTL(this.currentLocale);
    }

    getSupportedLanguages(): typeof SupportedLanguages {
        return SupportedLanguages;
    }

    getSupportedRegions(): typeof SupportedRegions {
        return SupportedRegions;
    }

    getLocaleConstants(): typeof LocaleConstants {
        return LocaleConstants;
    }
}