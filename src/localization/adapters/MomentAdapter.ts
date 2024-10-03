import { ILocalizationService } from '../interfaces/ILocalizationService';
import { LocalizationTypes } from '../types/LocalizationTypes';
import { DateTimeUtils } from '../utils/DateTimeUtils';
import { LocaleConstants } from '../constants/LocaleConstants';
import moment from 'moment';

/**
 * MomentAdapter class implements the ILocalizationService interface to provide
 * date and time formatting functionality using the Moment.js library.
 */
export class MomentAdapter implements ILocalizationService {
  private moment: typeof moment;

  /**
   * Initializes the MomentAdapter with an instance of Moment.js.
   * @param momentInstance An instance of Moment.js
   */
  constructor(momentInstance: typeof moment) {
    this.moment = momentInstance;
  }

  /**
   * Sets the current locale for Moment.js.
   * @param locale The locale code as a string
   */
  setLocale(locale: string): void {
    this.moment.locale(locale);
  }

  /**
   * Retrieves the current locale from Moment.js.
   * @returns The current locale code as a string
   */
  getLocale(): string {
    return this.moment.locale();
  }

  /**
   * Formats a date according to the current locale and provided format using Moment.js.
   * @param value The Date object to format
   * @param format The format string (optional)
   * @returns The formatted date string
   */
  formatDate(value: Date, format?: string): string {
    return this.moment(value).format(format || LocaleConstants.DEFAULT_DATE_FORMAT);
  }

  /**
   * Parses a date string according to the current locale and provided format using Moment.js.
   * @param dateString The date string to parse
   * @param format The format string (optional)
   * @returns The parsed Date object
   */
  parseDate(dateString: string, format?: string): Date {
    const parsedMoment = this.moment(dateString, format || LocaleConstants.DEFAULT_DATE_FORMAT);
    return parsedMoment.toDate();
  }

  /**
   * Checks if a given date string is valid according to the current locale and provided format.
   * @param dateString The date string to validate
   * @param format The format string (optional)
   * @returns A boolean indicating whether the date string is valid
   */
  isValidDate(dateString: string, format?: string): boolean {
    return this.moment(dateString, format || LocaleConstants.DEFAULT_DATE_FORMAT, true).isValid();
  }

  /**
   * Returns the localized date format string for the current locale.
   * @returns The localized date format string
   */
  getLocalizedDateFormat(): string {
    return this.moment.localeData().longDateFormat('L');
  }

  /**
   * Returns the localized time format string for the current locale.
   * @returns The localized time format string
   */
  getLocalizedTimeFormat(): string {
    return this.moment.localeData().longDateFormat('LT');
  }
}

// Export the MomentAdapter as the default export
export default MomentAdapter;