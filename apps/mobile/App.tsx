import '~/global.css';

import '@/localization';

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/context/AuthContext';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { WalletProvider } from '@/context/WalletContext';
import { NetworkProvider } from '@/context/NetworkContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NAV_THEME } from '@/lib/constants';
import AppNavigator from '@/navigation/AppNavigator';
import { AppProvider } from '@/providers/App';

export default function App() {
  return (
    <NavigationContainer theme={NAV_THEME.LIGHT}>
      <SafeAreaProvider>
        <OnboardingProvider>
          <NetworkProvider>
            <WalletProvider>
              <AuthProvider>
                <AppProvider>
                  <AppNavigator />
                </AppProvider>
              </AuthProvider>
            </WalletProvider>
          </NetworkProvider>
        </OnboardingProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
