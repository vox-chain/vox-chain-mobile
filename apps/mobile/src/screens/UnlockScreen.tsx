import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { SECURE_KEYS, STORAGE_KEYS } from '../lib/constants';

import { Button, Separator, Text } from '@/components/reusables';

export const UnlockScreen = () => {
  const { authenticate } = useAuth();
  const toast = useToast();

  const handleAuthenticate = async () => {
    const success = await authenticate();
    if (success) toast.success('Authentication successful');
    else toast.error('Authentication failed');
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_PRIVATE_KEY, 'false');
      await AsyncStorage.clear();
      await SecureStore.deleteItemAsync(SECURE_KEYS.PK);
      console.log('All Storage cleared, Wallet rested');
    } catch (e) {
      console.error('Failed to clear Storage', e);
    }
  };

  return (
    <View className="p-7 items-center flex-1 bg-background">
      <View className="flex-1 justify-center gap-5">
        <Image source={require('../../assets/Logo.png')} style={styles.logo} />
        <Button onPress={handleAuthenticate}>
          <Text>Unlock Wallet</Text>
        </Button>
      </View>
      <Separator />
      <View className="flex-1 justify-center gap-10">
        <Text className="text-center">
          Wallet won't unlock ? you can ERASE your current wallet and create new one or connect
          again using secret phrase
        </Text>
        <Button onPress={clearAll}>
          <Text>Reset Wallet</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
    marginBottom: 20, // Space between the logo and the button
  },
});
