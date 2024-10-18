import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const HeaderRight = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <View className="flex-row mr-5 gap-5 items-center">
      <TouchableOpacity onPress={toggleTheme}>
        <Ionicons
          name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
          size={24}
          color={isDarkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={logout}>
        <Ionicons name="power-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRight;
