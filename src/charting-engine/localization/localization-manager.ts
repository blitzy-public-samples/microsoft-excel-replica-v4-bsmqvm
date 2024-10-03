import { ChartTypes } from '../../types';
import { ILocalizationService } from '../../../localization/interfaces/ILocalizationService';
import { LocaleModel } from '../../../localization/models/LocaleModel';
import { LocaleConstants } from '../../../localization/constants/LocaleConstants';
import { LocaleUtils } from '../../../localization/utils/LocaleUtils';
import i18next from 'i18next';

/**
 * LocalizationManager class
 * Manages localization for the charting engine in Microsoft Excel
 */
export class LocalizationManager implements ILocalizationService {
    private currentLocale: string;
    private i18n: i18next.i18n;

    /**
     * Constructor for LocalizationManager
     * @param localizationService The localization service to be used
     */
    constructor(private localizationService: ILocalizationService) {
        this.currentLocale = LocaleConstants.DEFAULT_LOCALE;
        this.i18n = i18next.createInstance();
        this.initializeI18next();
    }

    /**
     * Initialize i18next with default options
     */
    private initializeI18next(): void {
        this.i18n.init({
            lng: this.currentLocale,
            fallbackLng: LocaleConstants.FALLBACK_LOCALE,
            interpolation: {
                escapeValue: false
            },
            // Add more i18next configuration options as needed
        });
    }

    /**
     * Sets the current locale for the charting engine
     * @param locale The locale code to set
     * @returns A promise that resolves when the locale is set
     */
    public async setLocale(locale: string): Promise<void> {
        if (!LocaleUtils.isValidLocale(locale)) {
            throw new Error(`Invalid locale: ${locale}`);
        }

        this.currentLocale = locale;
        await this.i18n.changeLanguage(locale);
        await this.loadTranslationResources(locale);
    }

    /**
     * Gets the current locale for the charting engine
     * @returns The current locale code
     */
    public getLocale(): string {
        return this.currentLocale;
    }

    /**
     * Translates a given key into the current locale
     * @param key The translation key
     * @param options Optional parameters for translation
     * @returns The translated string
     */
    public translate(key: string, options?: object): string {
        return this.i18n.t(key, options);
    }

    /**
     * Formats a number according to the current locale
     * @param value The number to format
     * @param options Optional Intl.NumberFormatOptions
     * @returns The formatted number string
     */
    public formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
        return new Intl.NumberFormat(this.currentLocale, options).format(value);
    }

    /**
     * Formats a date according to the current locale
     * @param date The date to format
     * @param options Optional Intl.DateTimeFormatOptions
     * @returns The formatted date string
     */
    public formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
        return new Intl.DateTimeFormat(this.currentLocale, options).format(date);
    }

    /**
     * Loads translation resources for the specified locale
     * @param locale The locale to load resources for
     */
    private async loadTranslationResources(locale: string): Promise<void> {
        try {
            const resources = await this.localizationService.loadTranslationResources(locale);
            this.i18n.addResourceBundle(locale, 'translation', resources, true, true);
        } catch (error) {
            console.error(`Failed to load translation resources for locale: ${locale}`, error);
            throw error;
        }
    }

    /**
     * Localizes chart labels and titles
     * @param chartType The type of chart
     * @param labels Array of labels to localize
     * @returns Localized labels
     */
    public localizeChartLabels(chartType: ChartTypes, labels: string[]): string[] {
        return labels.map(label => this.translate(`chart.${chartType}.${label}`));
    }

    /**
     * Localizes chart-specific terms
     * @param term The term to localize
     * @returns Localized term
     */
    public localizeChartTerm(term: string): string {
        return this.translate(`chart.terms.${term}`);
    }
}

export default LocalizationManager;