import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the Theme interface
interface Theme {
  // Add theme properties here
  // For example:
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
}

// Define the light and dark themes
const lightTheme: Theme = {
  primaryColor: '#0078D4',
  backgroundColor: '#FFFFFF',
  textColor: '#252525',
};

const darkTheme: Theme = {
  primaryColor: '#0078D4',
  backgroundColor: '#252525',
  textColor: '#FFFFFF',
};

// Define the shape of the Theme context
interface IThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Create the Theme context
const ThemeContext = createContext<IThemeContext | undefined>(undefined);

// Create the ThemeProvider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === lightTheme ? darkTheme : lightTheme);
  };

  const contextValue: IThemeContext = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the Theme context
export const useTheme = (): IThemeContext => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export the themes for use in other components
export { lightTheme, darkTheme };