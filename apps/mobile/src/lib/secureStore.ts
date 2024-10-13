import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

import { AppError } from './utils';

import { SECURE_KEYS } from '@/lib/constants';

type SecureStoreKey = (typeof SECURE_KEYS)[keyof typeof SECURE_KEYS];

export const getValueFor = async (key: SecureStoreKey): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error getting value from SecureStore for key:${key}:`, error);
    return null;
  }
};

export const setValue = async (key: SecureStoreKey, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error saving value to SecureStore for key:${key}:`, error);
  }
};

export const setPrivateKey = async (value: string): Promise<void> => {
  await SecureStore.setItemAsync(SECURE_KEYS.PK, value, {
    requireAuthentication: false,
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    authenticationPrompt: 'Unlock to proceed',
  });
};

export const getPrivateKey = async (): Promise<string | null> => {
  return await getValueFor(SECURE_KEYS.PK);
};

export async function getAuthenticatedValue(key: SecureStoreKey): Promise<string | null> {
  const authResult = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access your wallet',
    fallbackLabel: 'Use passcode',
  });

  if (!authResult.success) {
    if (authResult.warning) console.debug(authResult.warning);
    if (authResult.error === 'user_cancel') throw new AppError('You must authenticate first.');
    throw new AppError('Authentication Failed.');
  }
  return await getValueFor(key);
}

/**
 * setAuthenticatedValue - function to set a value in SecureStore after authenticating
 * @param key Secure store key
 * @param value Value to set for the key
 *
 * @note This function uses the LocalAuthentication API to authenticate the user before setting the value
 * @throws {AppError} if authentication fails or is cancelled
 */
export async function setAuthenticatedValue(key: SecureStoreKey, value: string): Promise<void> {
  const authResult = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to proceed',
    fallbackLabel: 'Use passcode',
  });

  if (!authResult.success) {
    if (authResult.warning) console.debug(authResult.warning);
    if (authResult.error === 'user_cancel') throw new AppError('You must authenticate first.');
    throw new AppError('Authentication Failed.');
  }

  await setValue(key, value);
}

export async function getAuthenticatedPrivateKey() {
  return await getAuthenticatedValue(SECURE_KEYS.PK);
}

export async function setAuthenticatedPrivateKey(privateKey: string) {
  await setAuthenticatedValue(SECURE_KEYS.PK, privateKey);
}

export default {
  getValueFor,
  setValue,
  setPrivateKey,
  getPrivateKey,
  getAuthenticatedValue,
  setAuthenticatedValue,
  getAuthenticatedPrivateKey,
  setAuthenticatedPrivateKey,
};
