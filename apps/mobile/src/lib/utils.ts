import { clsx, type ClassValue } from 'clsx';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { NAV_THEME } from '../lib/constants';

/**
 * setAndroidNavigationBar - A utility function to set the Android navigation bar color
 * @param theme - The theme to set the navigation bar to
 * @returns Promise<void>
 *
 * @note This function works only for Android.
 */
export async function setAndroidNavigationBar(theme: 'light' | 'dark') {
  if (Platform.OS !== 'android') return;
  await NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark');
  await NavigationBar.setBackgroundColorAsync(
    theme === 'dark' ? NAV_THEME.DARK.colors.background : NAV_THEME.LIGHT.colors.background
  );
}

/**
 * cn - A utility function to merge class names
 * @param inputs - The class names to merge
 * @returns The merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * AppError - A custom error class for operational errors
 * @param message - The error message
 * @param isOperational - Always true.
 */
export class AppError extends Error {
  public isOperational = true;
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * sleep - A utility function to pause execution for a given time
 * @param ms - The time to pause in milliseconds
 * @returns Promise<void>
 */
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
