import mongoose, { Document, Schema } from 'mongoose';
import { LocalizationError } from '../errors/LocalizationError';

// Define the interface for the Translation document
export interface ITranslation extends Document {
  key: string;
  language: string;
  translation: string;
  context?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the Translation model
const TranslationSchema: Schema = new Schema({
  key: { type: String, required: true },
  language: { type: String, required: true },
  translation: { type: String, required: true },
  context: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create a compound index for key and language to ensure uniqueness
TranslationSchema.index({ key: 1, language: 1 }, { unique: true });

// Create the Mongoose model
const TranslationModel = mongoose.model<ITranslation>('Translation', TranslationSchema);

export class TranslationModelClass {
  /**
   * Creates a new translation entry in the database.
   * @param key The unique identifier for the translation.
   * @param language The language code for the translation.
   * @param translation The translated text.
   * @param context Optional context for the translation.
   * @returns A promise that resolves to the created TranslationModel.
   */
  static async createTranslation(key: string, language: string, translation: string, context?: string): Promise<ITranslation> {
    try {
      const newTranslation = new TranslationModel({
        key,
        language,
        translation,
        context
      });
      return await newTranslation.save();
    } catch (error) {
      throw new LocalizationError('Error creating translation', error);
    }
  }

  /**
   * Retrieves a translation entry from the database based on the key and language.
   * @param key The unique identifier for the translation.
   * @param language The language code for the translation.
   * @returns A promise that resolves to the found TranslationModel or null if not found.
   */
  static async getTranslation(key: string, language: string): Promise<ITranslation | null> {
    try {
      return await TranslationModel.findOne({ key, language });
    } catch (error) {
      throw new LocalizationError('Error retrieving translation', error);
    }
  }

  /**
   * Updates an existing translation entry in the database.
   * @param key The unique identifier for the translation.
   * @param language The language code for the translation.
   * @param newTranslation The updated translated text.
   * @returns A promise that resolves to the updated TranslationModel or null if not found.
   */
  static async updateTranslation(key: string, language: string, newTranslation: string): Promise<ITranslation | null> {
    try {
      return await TranslationModel.findOneAndUpdate(
        { key, language },
        { translation: newTranslation },
        { new: true }
      );
    } catch (error) {
      throw new LocalizationError('Error updating translation', error);
    }
  }

  /**
   * Deletes a translation entry from the database.
   * @param key The unique identifier for the translation.
   * @param language The language code for the translation.
   * @returns A promise that resolves to true if the deletion was successful, false otherwise.
   */
  static async deleteTranslation(key: string, language: string): Promise<boolean> {
    try {
      const result = await TranslationModel.deleteOne({ key, language });
      return result.deletedCount > 0;
    } catch (error) {
      throw new LocalizationError('Error deleting translation', error);
    }
  }
}

export default TranslationModel;