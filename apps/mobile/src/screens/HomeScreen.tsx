import React, { useEffect } from 'react';
import { View } from 'react-native';

import Chat from '../components/Home/new/chat';
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

    initializeWallet();
  }, [loadWallet]);

  return (
    <View className="flex-1 pl-6 pr-6 pt-2">
      <Chat />
    </View>
  );
};

export default HomeScreen;
