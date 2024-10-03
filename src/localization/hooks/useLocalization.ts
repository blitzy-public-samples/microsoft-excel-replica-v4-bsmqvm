import React, { useContext } from 'react';
import { LocalizationContext } from '../context/LocalizationContext';
import { ILocalizationService } from '../interfaces/ILocalizationService';

/**
 * A custom React hook that provides access to the localization service.
 * This hook allows components to easily access localization functionality
 * throughout the Microsoft Excel application.
 *
 * @returns {ILocalizationService} The localization service instance
 */
export const useLocalization = (): ILocalizationService => {
  const localizationService = useContext(LocalizationContext);

  if (!localizationService) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }

  return localizationService;
};

export default useLocalization;