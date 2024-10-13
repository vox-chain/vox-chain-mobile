import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../lib/constants';

type AsyncStoreKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const getStorageValue = async (key: AsyncStoreKey): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting value from SecureStore for key:${key}:`, error);
    return null;
  }
};

export const setStorageValue = async (key: AsyncStoreKey, value: string): Promise<void> => {
  try {
    return AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error saving value to SecureStore for key:${key}:`, error);
  }
};

export default {
  getStorageValue,
  setStorageValue,
};
