import { useContext } from 'react';
import { LocalizationContext } from '../context/LocalizationContext';
import { LocaleFormattingService } from '../services/LocaleFormattingService';
import { LocaleFormattingFunctions } from '../types/LocalizationTypes';

/**
 * A custom React hook that provides access to locale-specific formatting functions.
 * This hook is part of the localization system for the Microsoft Excel application,
 * ensuring consistent functionality and user experience across platforms.
 *
 * @returns {LocaleFormattingFunctions} An object containing various formatting functions
 */
export const useLocaleFormatting = (): LocaleFormattingFunctions => {
  // Use React's useContext hook to access the LocalizationContext
  const { localeFormattingService } = useContext(LocalizationContext);

  // Ensure that the localeFormattingService is available
  if (!localeFormattingService) {
    throw new Error('LocaleFormattingService is not available in the LocalizationContext');
  }

  // Extract the LocaleFormattingService instance from the context
  const formattingService: LocaleFormattingService = localeFormattingService;

  // Return an object with formatting functions from the LocaleFormattingService
  return {
    formatNumber: formattingService.formatNumber,
    formatCurrency: formattingService.formatCurrency,
    formatDate: formattingService.formatDate,
    formatTime: formattingService.formatTime,
    formatDateTime: formattingService.formatDateTime,
    formatPercentage: formattingService.formatPercentage,
    formatDuration: formattingService.formatDuration,
    formatListSeparator: formattingService.formatListSeparator,
    getDecimalSeparator: formattingService.getDecimalSeparator,
    getThousandsSeparator: formattingService.getThousandsSeparator,
    getCurrencySymbol: formattingService.getCurrencySymbol,
    getDateFormat: formattingService.getDateFormat,
    getTimeFormat: formattingService.getTimeFormat,
  };
};

export default useLocaleFormatting;