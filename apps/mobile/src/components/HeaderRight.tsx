import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const HeaderRight = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigation = useNavigation(); // Get navigation object

  const handleUserCirclePress = () => {
    navigation.navigate('Portfolio' as never);
  };

  return (
    <View className="flex-row mr-5 gap-5 items-center">
      <TouchableOpacity onPress={toggleTheme}>
        <Ionicons
          name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
          size={24}
          color={isDarkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleUserCirclePress}>
        <Icon name="user-circle" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRight;
