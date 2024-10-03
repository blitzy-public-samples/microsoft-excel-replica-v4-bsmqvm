import { LocaleFormattingService } from '../services/LocaleFormattingService';
import { LocaleModel } from '../models/LocaleModel';
import { LocaleConstants } from '../constants/LocaleConstants';

describe('LocaleFormattingService', () => {
  let localeFormattingService: LocaleFormattingService;

  beforeEach(() => {
    localeFormattingService = new LocaleFormattingService();
  });

  describe('number formatting', () => {
    it('should format numbers correctly for different locales', () => {
      const testCases = [
        { locale: 'en-US', number: 1234567.89, expected: '1,234,567.89' },
        { locale: 'de-DE', number: 1234567.89, expected: '1.234.567,89' },
        { locale: 'fr-FR', number: 1234567.89, expected: '1 234 567,89' },
        { locale: 'ja-JP', number: 1234567.89, expected: '1,234,567.89' },
      ];

      testCases.forEach(({ locale, number, expected }) => {
        const result = localeFormattingService.formatNumber(number, new LocaleModel(locale));
        expect(result).toBe(expected);
      });
    });
  });

  describe('currency formatting', () => {
    it('should format currency correctly for different locales and currency codes', () => {
      const testCases = [
        { locale: 'en-US', amount: 1234.56, currency: 'USD', expected: '$1,234.56' },
        { locale: 'de-DE', amount: 1234.56, currency: 'EUR', expected: '1.234,56 €' },
        { locale: 'ja-JP', amount: 1234.56, currency: 'JPY', expected: '¥1,235' },
        { locale: 'en-GB', amount: 1234.56, currency: 'GBP', expected: '£1,234.56' },
      ];

      testCases.forEach(({ locale, amount, currency, expected }) => {
        const result = localeFormattingService.formatCurrency(amount, currency, new LocaleModel(locale));
        expect(result).toBe(expected);
      });
    });
  });

  describe('date formatting', () => {
    it('should format dates correctly for different locales', () => {
      const testDate = new Date('2023-04-15T12:00:00Z');
      const testCases = [
        { locale: 'en-US', expected: '4/15/2023' },
        { locale: 'de-DE', expected: '15.04.2023' },
        { locale: 'fr-FR', expected: '15/04/2023' },
        { locale: 'ja-JP', expected: '2023/04/15' },
      ];

      testCases.forEach(({ locale, expected }) => {
        const result = localeFormattingService.formatDate(testDate, new LocaleModel(locale));
        expect(result).toBe(expected);
      });
    });
  });

  describe('time formatting', () => {
    it('should format times correctly for different locales', () => {
      const testTime = new Date('2023-04-15T14:30:00Z');
      const testCases = [
        { locale: 'en-US', expected: '2:30 PM' },
        { locale: 'de-DE', expected: '14:30' },
        { locale: 'fr-FR', expected: '14:30' },
        { locale: 'ja-JP', expected: '14:30' },
      ];

      testCases.forEach(({ locale, expected }) => {
        const result = localeFormattingService.formatTime(testTime, new LocaleModel(locale));
        expect(result).toBe(expected);
      });
    });
  });

  describe('day names', () => {
    it('should return localized day names', () => {
      const testCases = [
        { locale: 'en-US', style: 'long', expected: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
        { locale: 'de-DE', style: 'short', expected: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] },
        { locale: 'fr-FR', style: 'narrow', expected: ['D', 'L', 'M', 'M', 'J', 'V', 'S'] },
      ];

      testCases.forEach(({ locale, style, expected }) => {
        const result = localeFormattingService.getDayNames(new LocaleModel(locale), style as 'long' | 'short' | 'narrow');
        expect(result).toEqual(expected);
      });
    });
  });

  describe('month names', () => {
    it('should return localized month names', () => {
      const testCases = [
        { locale: 'en-US', style: 'long', expected: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
        { locale: 'de-DE', style: 'short', expected: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] },
        { locale: 'fr-FR', style: 'narrow', expected: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] },
      ];

      testCases.forEach(({ locale, style, expected }) => {
        const result = localeFormattingService.getMonthNames(new LocaleModel(locale), style as 'long' | 'short' | 'narrow');
        expect(result).toEqual(expected);
      });
    });
  });

  describe('error handling', () => {
    it('should handle invalid inputs gracefully', () => {
      expect(() => localeFormattingService.formatNumber(NaN, new LocaleModel('en-US'))).toThrow();
      expect(() => localeFormattingService.formatCurrency(1000, 'INVALID', new LocaleModel('en-US'))).toThrow();
      expect(() => localeFormattingService.formatDate('invalid date', new LocaleModel('en-US'))).toThrow();
      expect(() => localeFormattingService.formatTime('invalid time', new LocaleModel('en-US'))).toThrow();
    });
  });

  describe('locale change', () => {
    it('should update formatting when locale is changed', () => {
      const number = 1234567.89;
      const date = new Date('2023-04-15T12:00:00Z');

      const initialLocale = new LocaleModel('en-US');
      const updatedLocale = new LocaleModel('de-DE');

      const initialNumberFormat = localeFormattingService.formatNumber(number, initialLocale);
      const initialDateFormat = localeFormattingService.formatDate(date, initialLocale);

      expect(initialNumberFormat).toBe('1,234,567.89');
      expect(initialDateFormat).toBe('4/15/2023');

      const updatedNumberFormat = localeFormattingService.formatNumber(number, updatedLocale);
      const updatedDateFormat = localeFormattingService.formatDate(date, updatedLocale);

      expect(updatedNumberFormat).toBe('1.234.567,89');
      expect(updatedDateFormat).toBe('15.04.2023');
    });
  });
});