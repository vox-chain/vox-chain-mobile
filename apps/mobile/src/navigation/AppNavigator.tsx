import { createStackNavigator } from '@react-navigation/stack';

import TabNavigator from './TabNavigator';
import { type RootStackParamList } from './types';
import { useOnboarding } from '../context/OnboardingContext';
import GetStartedPage from '../screens/GetStartedPage';
import ImportWalletScreen from '../screens/ImportWalletScreen';
import WalletCreationScreen from '../screens/WalletCreationScreen';
import WalletSetup from '../screens/WalletSetupScreen';

//import { useOnboarding } from '@/context/OnboardingContext';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { hasPrivateKey } = useOnboarding();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      {!hasPrivateKey ? (
        <>
          <Stack.Screen name="GetStarted" component={GetStartedPage} />
          <Stack.Screen name="WalletSetup" component={WalletSetup} />
          <Stack.Screen name="WalletCreationForm" component={WalletCreationScreen} />
          <Stack.Screen name="ImportWalletScreen" component={ImportWalletScreen} />
          <Stack.Screen name="Main" component={TabNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
}
