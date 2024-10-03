import React, { createContext, useMemo, useContext } from 'react';
import { ILocalizationService } from '../interfaces/ILocalizationService';
import { LocalizationService } from '../services/LocalizationService';
import { LocalizationConfig } from '../config/LocalizationConfig';

// Create a context for the localization service
const LocalizationContext = createContext<ILocalizationService | null>(null);

// Props interface for the LocalizationProvider component
interface LocalizationProviderProps {
  children: React.ReactNode;
}

// LocalizationProvider component
export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  // Initialize the LocalizationService with the LocalizationConfig
  const localizationService = useMemo(() => {
    return new LocalizationService(LocalizationConfig);
  }, []);

  return (
    <LocalizationContext.Provider value={localizationService}>
      {children}
    </LocalizationContext.Provider>
  );
};

// Custom hook to access the localization context
export const useLocalizationContext = (): ILocalizationService => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalizationContext must be used within a LocalizationProvider');
  }
  return context;
};

// Export the LocalizationContext for advanced use cases
export { LocalizationContext };