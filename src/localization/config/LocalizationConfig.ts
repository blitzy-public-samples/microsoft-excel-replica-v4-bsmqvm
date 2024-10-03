import { LocaleType } from '../types/LocalizationTypes';

/**
 * Configuration settings for the localization system in the Microsoft Excel project.
 * This object defines various options and parameters that control how localization
 * is handled throughout the application.
 */
const LocalizationConfig = {
  /**
   * Sets the default locale for the application.
   * TODO: Import and use DEFAULT_LOCALE from LocaleConstants when available.
   */
  defaultLocale: 'en-US' as LocaleType,

  /**
   * Defines the fallback locale.
   * TODO: Import and use FALLBACK_LOCALE from LocaleConstants when available.
   */
  fallbackLocale: 'en-US' as LocaleType,

  /**
   * An array of supported locales.
   * TODO: Import and use SUPPORTED_LOCALES from LocaleConstants when available.
   */
  supportedLocales: ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN'] as LocaleType[],

  /**
   * The key used for storing locale preferences.
   * TODO: Import and use LOCALE_STORAGE_KEY from LocaleConstants when available.
   */
  localeStorageKey: 'excel_preferred_locale',

  /**
   * The query parameter name for specifying locales in URLs.
   * TODO: Import and use LOCALE_QUERY_PARAM from LocaleConstants when available.
   */
  localeQueryParam: 'lang',

  /**
   * A string or function that defines the path pattern for loading translation files.
   */
  loadPath: '/locales/{{lng}}/{{ns}}.json',

  /**
   * An object containing settings for string interpolation, such as prefix and suffix for variables.
   */
  interpolation: {
    prefix: '{{',
    suffix: '}}',
  },

  /**
   * An object containing custom formatting functions for dates, numbers, and currencies.
   */
  formatters: {
    // Add custom formatters here
  },

  /**
   * An array or function defining the fallback language resolution order.
   */
  fallbackLng: ['en-US'],

  /**
   * An object containing settings for automatic locale detection, including order of detection methods.
   */
  detection: {
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
    lookupQuerystring: 'lang',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    caches: ['localStorage', 'cookie'],
  },

  /**
   * Settings for caching translations to improve performance.
   */
  cache: {
    enabled: true,
    expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  /**
   * Rules and settings for handling pluralization across different languages.
   */
  pluralization: {
    // Add pluralization rules here
  },
};

export default LocalizationConfig;