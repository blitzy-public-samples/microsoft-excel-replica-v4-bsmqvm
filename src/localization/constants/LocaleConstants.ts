// Import dependencies
// Note: These imports are based on the expected structure, but the files might not exist yet
import { SupportedLanguages } from './SupportedLanguages';
import { SupportedRegions } from './SupportedRegions';
import { LocaleType } from '../types/LocalizationTypes';

/**
 * This file contains constant values related to localization in the Microsoft Excel project.
 * It defines various locale-related constants that are used throughout the localization module.
 */

/**
 * The default locale for the application.
 * This should be set to a widely used locale, such as English (United States).
 */
export const DEFAULT_LOCALE: LocaleType = {
  language: SupportedLanguages.ENGLISH,
  region: SupportedRegions.UNITED_STATES
};

/**
 * The fallback locale to use when the requested locale is not available.
 * This should typically be the same as the DEFAULT_LOCALE.
 */
export const FALLBACK_LOCALE: LocaleType = DEFAULT_LOCALE;

/**
 * An array of supported locales in the application.
 * This should be populated with all the locales that the application supports.
 */
export const SUPPORTED_LOCALES: LocaleType[] = [
  DEFAULT_LOCALE,
  // Add other supported locales here
  // Example: { language: SupportedLanguages.SPANISH, region: SupportedRegions.SPAIN },
];

/**
 * The key used to store the user's preferred locale in local storage.
 */
export const LOCALE_STORAGE_KEY: string = 'excel_user_locale';

/**
 * The query parameter name used to specify the locale in URLs.
 */
export const LOCALE_QUERY_PARAM: string = 'locale';

/**
 * Human tasks:
 * 1. Update the SUPPORTED_LOCALES array with all the locales that the application should support.
 * 2. Ensure that the SupportedLanguages and SupportedRegions files are created and populated with the correct values.
 * 3. Verify that the LocaleType in LocalizationTypes.ts is correctly defined to match the structure used in this file.
 * 4. Review and adjust the DEFAULT_LOCALE and FALLBACK_LOCALE if necessary, based on the target audience of the application.
 */