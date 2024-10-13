import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';

import { STORAGE_KEYS } from '../lib/constants';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();
  async function loadColorScheme() {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    if (!theme) {
      AsyncStorage.setItem(STORAGE_KEYS.THEME, colorScheme ?? 'dark');
      return;
    }

    const colorTheme = theme === 'dark' ? 'dark' : 'light';
    if (colorTheme !== colorScheme) setColorScheme(colorTheme);
  }

  return {
    colorScheme: colorScheme ?? 'dark',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
    loadColorScheme,
  };
}
