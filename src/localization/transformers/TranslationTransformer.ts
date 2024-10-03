import { TranslationModel } from '../models/TranslationModel';
import { ApiTranslation, DatabaseTranslation, FileFormatTranslation } from '../types/LocalizationTypes';
import { LocalizationError } from '../errors/LocalizationError';

/**
 * TranslationTransformer class
 * Provides methods for transforming translation data between different formats.
 */
export class TranslationTransformer {
  /**
   * Transforms a TranslationModel instance to a format suitable for API responses.
   * @param translation TranslationModel instance to transform
   * @returns The transformed translation in API format
   */
  static toApiFormat(translation: TranslationModel): ApiTranslation {
    try {
      // Extract necessary properties from the TranslationModel
      const { id, key, value, locale, context } = translation;

      // Create and return an ApiTranslation object
      return {
        id,
        key,
        value,
        locale,
        context,
      };
    } catch (error) {
      throw new LocalizationError('Error transforming translation to API format', error);
    }
  }

  /**
   * Transforms an API format translation object to a TranslationModel instance.
   * @param apiTranslation ApiTranslation object to transform
   * @returns The transformed TranslationModel instance
   */
  static fromApiFormat(apiTranslation: ApiTranslation): TranslationModel {
    try {
      // Extract properties from the ApiTranslation object
      const { id, key, value, locale, context } = apiTranslation;

      // Create and return a new TranslationModel instance
      return new TranslationModel(id, key, value, locale, context);
    } catch (error) {
      throw new LocalizationError('Error transforming API format to translation', error);
    }
  }

  /**
   * Transforms a TranslationModel instance to a format suitable for database storage.
   * @param translation TranslationModel instance to transform
   * @returns The transformed translation in database format
   */
  static toDatabaseFormat(translation: TranslationModel): DatabaseTranslation {
    try {
      // Extract necessary properties from the TranslationModel
      const { id, key, value, locale, context, createdAt, updatedAt } = translation;

      // Create and return a DatabaseTranslation object
      return {
        id,
        key,
        value,
        locale,
        context,
        created_at: createdAt.toISOString(),
        updated_at: updatedAt.toISOString(),
      };
    } catch (error) {
      throw new LocalizationError('Error transforming translation to database format', error);
    }
  }

  /**
   * Transforms a database format translation object to a TranslationModel instance.
   * @param dbTranslation DatabaseTranslation object to transform
   * @returns The transformed TranslationModel instance
   */
  static fromDatabaseFormat(dbTranslation: DatabaseTranslation): TranslationModel {
    try {
      // Extract properties from the DatabaseTranslation object
      const { id, key, value, locale, context, created_at, updated_at } = dbTranslation;

      // Create and return a new TranslationModel instance
      return new TranslationModel(
        id,
        key,
        value,
        locale,
        context,
        new Date(created_at),
        new Date(updated_at)
      );
    } catch (error) {
      throw new LocalizationError('Error transforming database format to translation', error);
    }
  }

  /**
   * Transforms an array of TranslationModel instances to a format suitable for file storage (e.g., JSON or YAML).
   * @param translations Array of TranslationModel instances to transform
   * @returns The transformed translations in file format
   */
  static toFileFormat(translations: TranslationModel[]): FileFormatTranslation {
    try {
      // Transform each TranslationModel instance to a suitable file format representation
      const fileFormatTranslations = translations.map((translation) => ({
        key: translation.key,
        value: translation.value,
        locale: translation.locale,
        context: translation.context,
      }));

      // Combine the transformed representations into a FileFormatTranslation object
      return {
        translations: fileFormatTranslations,
        metadata: {
          version: '1.0',
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new LocalizationError('Error transforming translations to file format', error);
    }
  }

  /**
   * Transforms a file format translation object to an array of TranslationModel instances.
   * @param fileTranslations FileFormatTranslation object to transform
   * @returns An array of transformed TranslationModel instances
   */
  static fromFileFormat(fileTranslations: FileFormatTranslation): TranslationModel[] {
    try {
      // Parse the FileFormatTranslation object
      const { translations } = fileTranslations;

      // Iterate through the parsed translations and create TranslationModel instances
      return translations.map((translation) => {
        const { key, value, locale, context } = translation;
        return new TranslationModel(undefined, key, value, locale, context);
      });
    } catch (error) {
      throw new LocalizationError('Error transforming file format to translations', error);
    }
  }
}