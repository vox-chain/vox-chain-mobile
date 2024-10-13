import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { useAuth } from '../context/AuthContext';
import { NetworkProvider } from '../context/NetworkContext';
import { useOnboarding } from '../context/OnboardingContext';
import { ThemeProvider } from '../context/ThemeContext';
import { useColorScheme } from '../hooks/useColorScheme';
import { loadLocal } from '../localization';
import StartingScreen from '../screens/StartingScreen';
import { UnlockScreen } from '../screens/UnlockScreen';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { hasPrivateKey } = useOnboarding();
  const { isDarkColorScheme, loadColorScheme } = useColorScheme();
  const { isAuthenticated } = useAuth();

  const [isAppInitialized, setIsAppInitialized] = useState(false);

  async function initializeApp() {
    try {
      await Promise.all([loadLocal(), loadColorScheme()]);
    } catch (error) {
      console.error('App Initialization failed:', error);
    } finally {
      setIsAppInitialized(true);
    }
  }

  useEffect(() => {
    initializeApp();
  }, []);

  if (!isAppInitialized)
    return (
      <ThemeProvider>
        <StartingScreen />
      </ThemeProvider>
    );

  return (
    <ThemeProvider>
      <NetworkProvider>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <GestureHandlerRootView style={{ flex: 1 }}>
          {isAuthenticated || !hasPrivateKey ? <>{children}</> : <UnlockScreen />}
          <PortalHost />
          <Toast />
        </GestureHandlerRootView>
      </NetworkProvider>
    </ThemeProvider>
  );
}
