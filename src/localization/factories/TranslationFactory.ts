import { LocalizationError } from '../errors/LocalizationError';
import { TranslationModel } from '../models/TranslationModel';

export class TranslationFactory {
  /**
   * Creates a new translation entry.
   * @param key - The key for the translation.
   * @param language - The language of the translation.
   * @param translation - The translated text.
   * @param context - The context for the translation.
   * @returns A promise that resolves to the created TranslationModel.
   */
  public static async createTranslation(
    key: string,
    language: string,
    translation: string,
    context: string
  ): Promise<TranslationModel> {
    try {
      // Validate input parameters
      this.validateInputParameters(key, language, translation, context);

      // Call TranslationModel.createTranslation with provided parameters
      const createdTranslation = await TranslationModel.createTranslation(key, language, translation, context);

      return createdTranslation;
    } catch (error) {
      // Handle potential errors and wrap them in LocalizationError
      throw new LocalizationError('Error creating translation', error);
    }
  }

  /**
   * Retrieves a translation entry based on the key and language.
   * @param key - The key for the translation.
   * @param language - The language of the translation.
   * @returns A promise that resolves to the found TranslationModel or null if not found.
   */
  public static async getTranslation(key: string, language: string): Promise<TranslationModel | null> {
    try {
      // Validate input parameters
      this.validateInputParameters(key, language);

      // Call TranslationModel.getTranslation with provided parameters
      const translation = await TranslationModel.getTranslation(key, language);

      return translation;
    } catch (error) {
      // Handle potential errors and wrap them in LocalizationError
      throw new LocalizationError('Error retrieving translation', error);
    }
  }

  /**
   * Updates an existing translation entry.
   * @param key - The key for the translation.
   * @param language - The language of the translation.
   * @param newTranslation - The new translated text.
   * @returns A promise that resolves to the updated TranslationModel or null if not found.
   */
  public static async updateTranslation(
    key: string,
    language: string,
    newTranslation: string
  ): Promise<TranslationModel | null> {
    try {
      // Validate input parameters
      this.validateInputParameters(key, language, newTranslation);

      // Call TranslationModel.updateTranslation with provided parameters
      const updatedTranslation = await TranslationModel.updateTranslation(key, language, newTranslation);

      return updatedTranslation;
    } catch (error) {
      // Handle potential errors and wrap them in LocalizationError
      throw new LocalizationError('Error updating translation', error);
    }
  }

  /**
   * Deletes a translation entry.
   * @param key - The key for the translation.
   * @param language - The language of the translation.
   * @returns A promise that resolves to true if the deletion was successful, false otherwise.
   */
  public static async deleteTranslation(key: string, language: string): Promise<boolean> {
    try {
      // Validate input parameters
      this.validateInputParameters(key, language);

      // Call TranslationModel.deleteTranslation with provided parameters
      const isDeleted = await TranslationModel.deleteTranslation(key, language);

      return isDeleted;
    } catch (error) {
      // Handle potential errors and wrap them in LocalizationError
      throw new LocalizationError('Error deleting translation', error);
    }
  }

  /**
   * Validates input parameters for the factory methods.
   * @param params - The parameters to validate.
   * @throws LocalizationError if any parameter is invalid.
   */
  private static validateInputParameters(...params: string[]): void {
    for (const param of params) {
      if (!param || typeof param !== 'string' || param.trim() === '') {
        throw new LocalizationError('Invalid input parameter');
      }
    }
  }
}