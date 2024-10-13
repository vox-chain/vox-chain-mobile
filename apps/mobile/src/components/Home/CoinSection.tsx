import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

const CoinSection: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.ethContainer}>
        <FontAwesome5 name="ethereum" size={40} color={isDarkMode ? 'white' : 'black'} />
        <Text style={[styles.ethAmount, isDarkMode ? styles.darkText : styles.lightText]}>
          0 ETH
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ethContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  ethAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
});

export default CoinSection;
