import { TranslationModel } from '../models/TranslationModel';
import { LocalizationError } from '../errors/LocalizationError';
import { SUPPORTED_LANGUAGES } from '../constants/SupportedLanguages';

export class TranslationValidator {
  /**
   * Validates the provided translation data against the expected schema and constraints.
   * @param data Partial<TranslationModel> The translation data to validate
   * @throws LocalizationError if validation fails
   */
  public static validateTranslationData(data: Partial<TranslationModel>): void {
    this.validateKey(data.key);
    this.validateLanguage(data.language);
    this.validateTranslation(data.translation);
    this.validateContext(data.context);
  }

  /**
   * Validates the translation key.
   * @param key string The key to validate
   * @throws LocalizationError if validation fails
   */
  private static validateKey(key: string | undefined): void {
    if (!key || typeof key !== 'string') {
      throw new LocalizationError('Invalid key: Key must be a non-empty string');
    }

    if (key.length < 1 || key.length > 100) {
      throw new LocalizationError('Invalid key: Key must be between 1 and 100 characters');
    }

    const keyRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!keyRegex.test(key)) {
      throw new LocalizationError('Invalid key: Key must contain only alphanumeric characters, underscores, dots, and hyphens');
    }
  }

  /**
   * Validates the language code.
   * @param language string The language code to validate
   * @throws LocalizationError if validation fails
   */
  private static validateLanguage(language: string | undefined): void {
    if (!language || typeof language !== 'string') {
      throw new LocalizationError('Invalid language: Language must be a non-empty string');
    }

    const languageRegex = /^[a-z]{2}-[A-Z]{2}$/;
    if (!languageRegex.test(language)) {
      throw new LocalizationError('Invalid language: Language must be in the format "xx-XX"');
    }

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw new LocalizationError(`Invalid language: ${language} is not supported`);
    }
  }

  /**
   * Validates the translated text.
   * @param translation string The translated text to validate
   * @throws LocalizationError if validation fails
   */
  private static validateTranslation(translation: string | undefined): void {
    if (!translation || typeof translation !== 'string') {
      throw new LocalizationError('Invalid translation: Translation must be a non-empty string');
    }

    if (translation.length > 1000) {
      throw new LocalizationError('Invalid translation: Translation must not exceed 1000 characters');
    }
  }

  /**
   * Validates the optional context information.
   * @param context string | undefined The context to validate
   * @throws LocalizationError if validation fails
   */
  private static validateContext(context: string | undefined): void {
    if (context !== undefined && typeof context !== 'string') {
      throw new LocalizationError('Invalid context: Context must be a string if provided');
    }

    if (context && context.length > 500) {
      throw new LocalizationError('Invalid context: Context must not exceed 500 characters');
    }
  }
}