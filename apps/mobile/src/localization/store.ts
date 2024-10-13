import AsyncStorage from '@react-native-async-storage/async-storage';

import { Local } from '.';
import { STORAGE_KEYS } from '../lib/constants';

export const STORAGE_KEY = STORAGE_KEYS.LOCAL;

export const getLocal = async (): Promise<Local | null> => {
  const local = await AsyncStorage.getItem(STORAGE_KEY);
  if (local) return local as Local;

  return null;
};

export const setLocal = async (local: Local) => {
  await AsyncStorage.setItem(STORAGE_KEY, local);
};
