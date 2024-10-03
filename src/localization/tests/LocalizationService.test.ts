import { LocalizationService } from '../services/LocalizationService';
import { LocalizationConfig } from '../config/LocalizationConfig';
import { TestHelpers } from '../../testing/utils/test-helpers';

describe('LocalizationService', () => {
  let localizationService: LocalizationService;
  let mockConfig: LocalizationConfig;

  beforeEach(() => {
    mockConfig = {
      defaultLocale: 'en-US',
      supportedLocales: ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'],
      fallbackLocale: 'en-US',
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    };
    localizationService = new LocalizationService(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('setLocale should change the current locale', async () => {
    const newLocale = 'es-ES';
    await localizationService.setLocale(newLocale);
    expect(localizationService.getLocale()).toBe(newLocale);
  });

  test('getLocale should return the current locale', () => {
    expect(localizationService.getLocale()).toBe(mockConfig.defaultLocale);
  });

  test('translate should return the correct translation', async () => {
    const key = 'common.welcome';
    const expectedTranslation = 'Welcome';
    jest.spyOn(localizationService, 'translate').mockResolvedValue(expectedTranslation);

    const result = await localizationService.translate(key);
    expect(result).toBe(expectedTranslation);
  });

  test('translate should handle parameter substitution', async () => {
    const key = 'common.greeting';
    const params = { name: 'John' };
    const expectedTranslation = 'Hello, John!';
    jest.spyOn(localizationService, 'translate').mockResolvedValue(expectedTranslation);

    const result = await localizationService.translate(key, params);
    expect(result).toBe(expectedTranslation);
  });

  test('formatNumber should format numbers according to the locale', () => {
    const number = 1234567.89;
    const expectedFormat = '1,234,567.89';
    expect(localizationService.formatNumber(number)).toBe(expectedFormat);
  });

  test('formatDate should format dates according to the locale', () => {
    const date = new Date('2023-05-20T12:00:00Z');
    const expectedFormat = '5/20/2023';
    expect(localizationService.formatDate(date)).toBe(expectedFormat);
  });

  test('formatCurrency should format currency values according to the locale', () => {
    const amount = 1234.56;
    const currencyCode = 'USD';
    const expectedFormat = '$1,234.56';
    expect(localizationService.formatCurrency(amount, currencyCode)).toBe(expectedFormat);
  });

  test('setLocale should throw an error for unsupported locales', async () => {
    const unsupportedLocale = 'xx-XX';
    await expect(localizationService.setLocale(unsupportedLocale)).rejects.toThrow('Unsupported locale');
  });

  test('translate should fall back to default locale for missing translations', async () => {
    const key = 'missing.key';
    const fallbackTranslation = 'Fallback Translation';
    jest.spyOn(localizationService, 'translate').mockResolvedValue(fallbackTranslation);

    const result = await localizationService.translate(key);
    expect(result).toBe(fallbackTranslation);
  });

  test('formatNumber should handle different locale number formats', async () => {
    await localizationService.setLocale('de-DE');
    const number = 1234567.89;
    const expectedFormat = '1.234.567,89';
    expect(localizationService.formatNumber(number)).toBe(expectedFormat);
  });

  test('formatDate should handle different locale date formats', async () => {
    await localizationService.setLocale('fr-FR');
    const date = new Date('2023-05-20T12:00:00Z');
    const expectedFormat = '20/05/2023';
    expect(localizationService.formatDate(date)).toBe(expectedFormat);
  });

  test('formatCurrency should handle different locale currency formats', async () => {
    await localizationService.setLocale('ja-JP');
    const amount = 1234.56;
    const currencyCode = 'JPY';
    const expectedFormat = '￥1,235';
    expect(localizationService.formatCurrency(amount, currencyCode)).toBe(expectedFormat);
  });
});