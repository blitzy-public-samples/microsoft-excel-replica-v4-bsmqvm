import { LocalizationService } from '@/localization/services/LocalizationService';
import { TranslationService } from '@/localization/services/TranslationService';
import { LocaleFormattingService } from '@/localization/services/LocaleFormattingService';
import { SupportedLanguages } from '@/localization/constants/SupportedLanguages';
import { SupportedRegions } from '@/localization/constants/SupportedRegions';

describe('Language Support', () => {
  let localizationService: LocalizationService;
  let translationService: TranslationService;
  let localeFormattingService: LocaleFormattingService;

  beforeEach(() => {
    localizationService = new LocalizationService();
    translationService = new TranslationService();
    localeFormattingService = new LocaleFormattingService();
  });

  test('LocalizationService supports all languages', () => {
    const supportedLanguages = Object.values(SupportedLanguages);
    supportedLanguages.forEach(language => {
      expect(localizationService.isLanguageSupported(language)).toBe(true);
    });
  });

  test('LocalizationService supports all regions', () => {
    const supportedRegions = Object.values(SupportedRegions);
    supportedRegions.forEach(region => {
      expect(localizationService.isRegionSupported(region)).toBe(true);
    });
  });

  test('TranslationService provides translations for all supported languages', () => {
    const testKey = 'common.welcome';
    const supportedLanguages = Object.values(SupportedLanguages);
    supportedLanguages.forEach(language => {
      const translation = translationService.translate(testKey, language);
      expect(translation).not.toBe(testKey);
      expect(translation.length).toBeGreaterThan(0);
    });
  });

  test('LocaleFormattingService formats numbers correctly for different locales', () => {
    const testNumber = 1234567.89;
    const locales = ['en-US', 'de-DE', 'fr-FR', 'ja-JP'];
    const expectedFormats = ['1,234,567.89', '1.234.567,89', '1 234 567,89', '1,234,567.89'];

    locales.forEach((locale, index) => {
      const formattedNumber = localeFormattingService.formatNumber(testNumber, locale);
      expect(formattedNumber).toBe(expectedFormats[index]);
    });
  });

  test('LocaleFormattingService formats dates correctly for different locales', () => {
    const testDate = new Date('2023-04-15T12:00:00Z');
    const locales = ['en-US', 'de-DE', 'fr-FR', 'ja-JP'];
    const expectedFormats = ['4/15/2023', '15.4.2023', '15/04/2023', '2023/4/15'];

    locales.forEach((locale, index) => {
      const formattedDate = localeFormattingService.formatDate(testDate, locale);
      expect(formattedDate).toBe(expectedFormats[index]);
    });
  });

  test('LocaleFormattingService formats currency correctly for different locales', () => {
    const testAmount = 1234.56;
    const locales = ['en-US', 'de-DE', 'fr-FR', 'ja-JP'];
    const currencies = ['USD', 'EUR', 'EUR', 'JPY'];
    const expectedFormats = ['$1,234.56', '1.234,56 €', '1 234,56 €', '¥1,235'];

    locales.forEach((locale, index) => {
      const formattedCurrency = localeFormattingService.formatCurrency(testAmount, locale, currencies[index]);
      expect(formattedCurrency).toBe(expectedFormats[index]);
    });
  });

  test('LocalizationService handles fallback languages correctly', () => {
    const unsupportedLanguage = 'xx-XX';
    const fallbackLanguage = SupportedLanguages.ENGLISH;
    
    expect(localizationService.getLanguage(unsupportedLanguage)).toBe(fallbackLanguage);
  });

  test('TranslationService handles missing translations gracefully', () => {
    const nonExistentKey = 'nonexistent.key';
    const language = SupportedLanguages.ENGLISH;

    const translation = translationService.translate(nonExistentKey, language);
    expect(translation).toBe(nonExistentKey);
  });

  test('LocaleFormattingService handles invalid locales gracefully', () => {
    const invalidLocale = 'invalid-locale';
    const fallbackLocale = 'en-US';

    const formattedNumber = localeFormattingService.formatNumber(1234.56, invalidLocale);
    expect(formattedNumber).toBe(localeFormattingService.formatNumber(1234.56, fallbackLocale));
  });
});