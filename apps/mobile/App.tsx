import '~/global.css';

import '@/localization';

// import crashlytics from '@react-native-firebase/crashlytics';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/context/AuthContext';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { WalletProvider } from '@/context/WalletContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NAV_THEME } from '@/lib/constants';
import AppNavigator from '@/navigation/AppNavigator';
import { AppProvider } from '@/providers/App';

export default function App() {
  const { isDarkColorScheme } = useColorScheme();

  // useEffect(() => {
  //   crashlytics().crash();
  // }, []);

  return (
    <NavigationContainer theme={isDarkColorScheme ? NAV_THEME.DARK : NAV_THEME.LIGHT}>
      <SafeAreaProvider>
        <OnboardingProvider>
          <WalletProvider>
            <AuthProvider>
              <AppProvider>
                <AppNavigator />
              </AppProvider>
            </AuthProvider>
          </WalletProvider>
        </OnboardingProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
