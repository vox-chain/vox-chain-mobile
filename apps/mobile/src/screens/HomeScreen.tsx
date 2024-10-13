import React, { useEffect } from 'react';
import { View } from 'react-native';

import AccountSection from '../components/Home/AccountSection';
import ActionsSection from '../components/Home/ActionsSection';
import BalanceDispaly from '../components/Home/BalanceDisplay';
import NetworkSelector from '../components/Home/SelectNetwork';
import TokensSection from '../components/Home/TokensSection';
import { useWallet } from '../context/WalletContext';
import { type TabScreenProps } from '../navigation/types';

const HomeScreen = ({ navigation }: TabScreenProps<'Home'>) => {
  const { loadWallet } = useWallet();
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        await loadWallet();
      } catch (error) {
        console.error('Error loading wallet:', error);
      }
    };

    initializeWallet(); // Call loadWallet on component mount
  }, [loadWallet]);

  return (
    <View className="flex-1 pl-6 pr-6 pt-2">
      <AccountSection />
      <NetworkSelector />
      <BalanceDispaly />
      <ActionsSection />
      <TokensSection />
    </View>
  );
};

export default HomeScreen;
