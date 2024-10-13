import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Separator } from '../reusables/separator';

import { useTheme } from '@/context/ThemeContext'; // Adjust the import path as necessary
import { useWallet } from '@/context/WalletContext';
import { useToast } from '~/src/hooks/useToast';

const AccountSection: React.FC = () => {
  const { isDarkMode } = useTheme();
  const toast = useToast();
  const { t } = useTranslation();
  const address = useWallet().address;
  const copyAddress = async () => {
    if (address) {
      await Clipboard.setStringAsync(address);
      toast.info('Address is copied');
    }
  };
  return (
    <View style={styles.accountContainer}>
      <Separator className="mb-3" />
      <Text style={[styles.accountLabel, isDarkMode ? styles.darkText : styles.lightText]}>
        {t('Account')}
      </Text>
      <View style={styles.addressContainer}>
        <Text style={[styles.addressText, isDarkMode ? styles.darkText : styles.lightText]}>
          {address?.slice(0, 6)}....{address?.slice(-4)}
        </Text>
        <TouchableOpacity onPress={copyAddress}>
          <Ionicons name="copy-outline" size={16} color={isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>
      <Separator className="mt-3" />
    </View>
  );
};

const styles = StyleSheet.create({
  accountContainer: {
    // borderTopWidth: 0.5,
    // borderBottomWidth: 0.5,
    // borderColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  accountLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
    textAlign: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
});

export default AccountSection;
