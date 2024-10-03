import { TranslationService } from '../services/TranslationService';
import { TranslationModel } from '../models/TranslationModel';
import { SupportedLanguages } from '../constants/SupportedLanguages';
import { LocalizationError } from '../errors/LocalizationError';

describe('TranslationService', () => {
  let translationService: TranslationService;

  beforeEach(() => {
    // Initialize TranslationService instance
    translationService = new TranslationService();
    // Mock necessary dependencies
    jest.spyOn(translationService, 'loadTranslations').mockResolvedValue();
  });

  afterEach(() => {
    // Reset mocks
    jest.restoreAllMocks();
  });

  test('initializes with the default locale', async () => {
    await translationService.initialize();
    expect(translationService.getLocale()).toBe('en-US');
  });

  test('setLocale and getLocale methods work correctly', async () => {
    await translationService.initialize();
    await translationService.setLocale('fr-FR');
    expect(translationService.getLocale()).toBe('fr-FR');
  });

  test('translate method returns correct translation for a simple key', async () => {
    await translationService.initialize();
    const mockTranslations: TranslationModel = {
      'en-US': {
        'greeting': 'Hello'
      }
    };
    jest.spyOn(translationService as any, 'translations', 'get').mockReturnValue(mockTranslations);

    const result = translationService.translate('greeting');
    expect(result).toBe('Hello');
  });

  test('translate method handles parameter substitution correctly', async () => {
    await translationService.initialize();
    const mockTranslations: TranslationModel = {
      'en-US': {
        'welcome': 'Welcome, {name}!'
      }
    };
    jest.spyOn(translationService as any, 'translations', 'get').mockReturnValue(mockTranslations);

    const result = translationService.translate('welcome', { name: 'John' });
    expect(result).toBe('Welcome, John!');
  });

  test('setLocale throws LocalizationError for unsupported locale', async () => {
    await translationService.initialize();
    await expect(translationService.setLocale('unsupported-locale')).rejects.toThrow(LocalizationError);
  });

  test('translate method throws LocalizationError for missing key', async () => {
    await translationService.initialize();
    const mockTranslations: TranslationModel = {
      'en-US': {}
    };
    jest.spyOn(translationService as any, 'translations', 'get').mockReturnValue(mockTranslations);

    expect(() => translationService.translate('missing_key')).toThrow(LocalizationError);
  });

  test('translate method falls back to default language if translation is missing', async () => {
    await translationService.initialize();
    await translationService.setLocale('fr-FR');
    const mockTranslations: TranslationModel = {
      'en-US': {
        'fallback': 'Fallback text'
      },
      'fr-FR': {}
    };
    jest.spyOn(translationService as any, 'translations', 'get').mockReturnValue(mockTranslations);

    const result = translationService.translate('fallback');
    expect(result).toBe('Fallback text');
  });

  test('translate method handles nested keys correctly', async () => {
    await translationService.initialize();
    const mockTranslations: TranslationModel = {
      'en-US': {
        'menu': {
          'file': 'File',
          'edit': 'Edit'
        }
      }
    };
    jest.spyOn(translationService as any, 'translations', 'get').mockReturnValue(mockTranslations);

    expect(translationService.translate('menu.file')).toBe('File');
    expect(translationService.translate('menu.edit')).toBe('Edit');
  });

  test('translate method handles array parameters correctly', async () => {
    await translationService.initialize();
    const mockTranslations: TranslationModel = {
      'en-US': {
        'list': 'Items: {items}'
      }
    };
    jest.spyOn(translationService as any, 'translations', 'get').mockReturnValue(mockTranslations);

    const result = translationService.translate('list', { items: ['apple', 'banana', 'orange'] });
    expect(result).toBe('Items: apple, banana, orange');
  });

  test('getSupportedLanguages returns correct list', () => {
    expect(translationService.getSupportedLanguages()).toEqual(SupportedLanguages);
  });
});