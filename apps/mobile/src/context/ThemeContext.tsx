import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { setAndroidNavigationBar } from '@/lib/utils';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  const toggleTheme = () => {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setAndroidNavigationBar(newTheme);
    setColorScheme(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode: isDarkColorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
