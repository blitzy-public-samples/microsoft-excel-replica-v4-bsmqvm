import { Request, Response, NextFunction } from 'express';
import { ILocalizationService } from '../interfaces/ILocalizationService';
import { LocalizationService } from '../services/LocalizationService';
import { LocaleUtils } from '../utils/LocaleUtils';
import { LocalizationConfig } from '../config/LocalizationConfig';

export class LocalizationMiddleware {
  private localizationService: ILocalizationService;

  constructor(config: LocalizationConfig) {
    this.localizationService = new LocalizationService(config);
  }

  public localizationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Determine the appropriate locale for the request
      const locale = this.determineLocale(req);

      // Set the locale for the current request
      this.setLocale(req, locale);

      // Attach localization methods to the request object
      this.attachLocalizationMethods(req);

      next();
    } catch (error) {
      console.error('Localization middleware error:', error);
      next(error);
    }
  };

  private determineLocale(req: Request): string {
    // Implement logic to determine the appropriate locale based on user preferences or defaults
    // This is a placeholder implementation
    const defaultLocale = 'en-US';
    const userLocale = req.headers['accept-language'] || defaultLocale;
    return LocaleUtils.getNormalizedLocale(userLocale);
  }

  private setLocale(req: Request, locale: string): void {
    // Set the locale for the current request
    req.locale = locale;
    this.localizationService.setCurrentLocale(locale);
  }

  private attachLocalizationMethods(req: Request): void {
    // Attach localization methods to the request object for use in route handlers
    req.t = (key: string, params?: Record<string, any>) => this.localizationService.translate(key, params);
    req.formatDate = (date: Date, format?: string) => this.localizationService.formatDate(date, format);
    req.formatNumber = (number: number, options?: Intl.NumberFormatOptions) => this.localizationService.formatNumber(number, options);
    req.formatCurrency = (amount: number, currency: string) => this.localizationService.formatCurrency(amount, currency);
  }
}

// Extend the Express Request interface to include localization methods
declare global {
  namespace Express {
    interface Request {
      locale: string;
      t: (key: string, params?: Record<string, any>) => string;
      formatDate: (date: Date, format?: string) => string;
      formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
      formatCurrency: (amount: number, currency: string) => string;
    }
  }
}

export const createLocalizationMiddleware = (config: LocalizationConfig) => {
  const middleware = new LocalizationMiddleware(config);
  return middleware.localizationMiddleware;
};