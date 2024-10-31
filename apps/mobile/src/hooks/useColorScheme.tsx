import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';

import { STORAGE_KEYS } from '../lib/constants';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();
  async function loadColorScheme() {
    // const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    // if (!theme) {
    //   AsyncStorage.setItem(STORAGE_KEYS.THEME, colorScheme ?? 'light');
    //   return;
    // }

    // const colorTheme = theme === 'light' ? 'light' : 'light';
    // if (colorTheme !== colorScheme)
    setColorScheme('light');
  }

  return {
    colorScheme: colorScheme ?? 'light',
    isDarkColorScheme: false,
    setColorScheme,
    toggleColorScheme,
    loadColorScheme,
  };
}
