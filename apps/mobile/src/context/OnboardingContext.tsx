import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { STORAGE_KEYS } from '../lib/constants';

type OnboardingContextProps = {
  hasPrivateKey: boolean;
};

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasPrivateKey, setHasPrivateKey] = useState<boolean>(false);

  useEffect(() => {
    checkUserHasPrivateKey();
  }, []);

  async function checkUserHasPrivateKey() {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_PRIVATE_KEY);

      if (value) setHasPrivateKey(true);
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  }

  return (
    <OnboardingContext.Provider value={{ hasPrivateKey }}>{children}</OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
