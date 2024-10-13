import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

const ActionsSection: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const clickHandler = () => {
    navigation.navigate('Main', {
      screen: 'TransferScreen',
    });
  };

  return (
    <View style={styles.buttonsContainer}>
      {['Buy', 'Transfer', 'Lend', 'Swap'].map((action, index) => (
        <TouchableOpacity onPress={clickHandler} key={index} style={styles.button}>
          <Ionicons
            name={
              action === 'Buy'
                ? 'card-outline'
                : action === 'Transfer'
                  ? 'arrow-forward-outline'
                  : action === 'Lend'
                    ? 'stats-chart-outline'
                    : 'swap-horizontal-outline'
            }
            size={24}
            color={isDarkMode ? 'white' : 'black'}
          />
          <Text style={isDarkMode ? styles.darkText : styles.lightText}>{t(action)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
});

export default ActionsSection;
