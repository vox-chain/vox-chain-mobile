import { Ionicons } from '@expo/vector-icons';
import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext'; // Import useTheme

const BottomBar = ({ navigation }: BottomTabBarProps) => {
  const { isDarkMode } = useTheme(); // Use the theme
  return (
    <View className="border-border border-t-hairline h-[60px] flex-row justify-around items-center">
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={25} color={isDarkMode ? 'white' : 'red'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Portfolio')}>
        <Ionicons name="wallet-outline" size={25} color={isDarkMode ? 'white' : 'red'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Pairings')}>
        <Ionicons name="git-network-outline" size={25} color={isDarkMode ? 'white' : 'red'} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;
