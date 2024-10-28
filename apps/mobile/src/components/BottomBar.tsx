import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '@/context/ThemeContext'; // Import useTheme

const BottomBar = ({ navigation }: BottomTabBarProps) => {
  const { isDarkMode } = useTheme(); // Use the theme
  return (
    <View className="border-border border-t-hairline h-[60px] flex-row justify-around items-center">
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={25} color={isDarkMode ? 'white' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
        <MaterialIcons name="contacts" size={25} color={isDarkMode ? 'white' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('History')}>
        <MaterialIcons name="history-edu" size={25} color={isDarkMode ? 'white' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Logs')}>
        <Icon name="math-log" size={25} color={isDarkMode ? 'white' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="settings" size={25} color={isDarkMode ? 'white' : 'black'} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;
