import { LanguageCode } from '../types/LocalizationTypes';

/**
 * This file defines the supported languages for the Microsoft Excel application's localization system.
 * It contains constants representing the languages that the application can be translated into and used with.
 */

/**
 * Array of supported language codes
 */
export const SUPPORTED_LANGUAGES: LanguageCode[] = [
  'en', // English
  'es', // Spanish
  'fr', // French
  'de', // German
  'it', // Italian
  'ja', // Japanese
  'ko', // Korean
  'pt', // Portuguese
  'ru', // Russian
  'zh', // Chinese
];

/**
 * Object mapping language codes to their respective names
 */
export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
};

/**
 * Default language code for the application
 */
export const DEFAULT_LANGUAGE: LanguageCode = 'en';

/**
 * Function to check if a given language code is supported
 * @param code The language code to check
 * @returns True if the language is supported, false otherwise
 */
export function isLanguageSupported(code: string): code is LanguageCode {
  return SUPPORTED_LANGUAGES.includes(code as LanguageCode);
}

/**
 * Function to get the language name for a given language code
 * @param code The language code
 * @returns The name of the language or undefined if not supported
 */
export function getLanguageName(code: LanguageCode): string | undefined {
  return LANGUAGE_NAMES[code];
}