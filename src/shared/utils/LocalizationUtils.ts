import i18next from 'i18next';
import moment from 'moment';

// Assuming this constant is defined in AppConstants.ts
const SUPPORTED_LOCALES = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN'];

// Assuming this function is defined in StringUtils.ts
function trimString(str: string): string {
    return str.trim();
}

/**
 * Formats a date according to the specified format and locale.
 * @param date The date to format
 * @param format The format string
 * @param locale The locale to use for formatting
 * @returns The formatted date string
 */
export function formatDate(date: Date, format: string, locale: string): string {
    return moment(date).locale(locale).format(format);
}

/**
 * Formats a number according to the specified locale and options.
 * @param number The number to format
 * @param locale The locale to use for formatting
 * @param options The Intl.NumberFormatOptions to use
 * @returns The formatted number string
 */
export function formatNumber(number: number, locale: string, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Formats a currency amount according to the specified currency code and locale.
 * @param amount The amount to format
 * @param currencyCode The currency code (e.g., 'USD', 'EUR')
 * @param locale The locale to use for formatting
 * @returns The formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string, locale: string): string {
    return formatNumber(amount, locale, { style: 'currency', currency: currencyCode });
}

/**
 * Translates a text key using the current locale and optional interpolation options.
 * @param key The translation key
 * @param options Optional interpolation options
 * @returns The translated text
 */
export function translateText(key: string, options?: object): string {
    return i18next.t(trimString(key), options);
}

/**
 * Determines if the given locale is a right-to-left (RTL) language.
 * @param locale The locale to check
 * @returns True if the locale is RTL, false otherwise
 */
export function isRTL(locale: string): boolean {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.some(lang => locale.startsWith(lang));
}

/**
 * Returns an array of supported locale codes.
 * @returns Array of supported locale codes
 */
export function getSupportedLocales(): string[] {
    return SUPPORTED_LOCALES;
}

/**
 * Sets the current locale for the application.
 * @param locale The locale to set
 */
export function setLocale(locale: string): void {
    if (getSupportedLocales().includes(locale)) {
        i18next.changeLanguage(locale);
        moment.locale(locale);
        // Update any necessary application-wide locale settings
    } else {
        console.warn(`Unsupported locale: ${locale}`);
    }
}

/**
 * Gets the current locale of the application.
 * @returns The current locale code
 */
export function getLocale(): string {
    return i18next.language;
}