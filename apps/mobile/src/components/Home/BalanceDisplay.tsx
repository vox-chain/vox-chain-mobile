import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useNetworkContext } from '../../context/NetworkContext';
import { useTheme } from '../../context/ThemeContext';
import { useWallet } from '../../context/WalletContext';
import { useToast } from '../../hooks/useToast';

const BalanceDisplay = () => {
  const { isDarkMode } = useTheme();
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const { network } = useNetworkContext();
  const { getBalance, loadWallet } = useWallet();
  const toast = useToast();

  useEffect(() => {
    let active = true;
    if (!network) {
      return;
    }
    const initializeWallet = async () => {
      try {
        await loadWallet();
      } catch (error) {
        console.error('Error loading wallet:', error);
      }
    };
    initializeWallet();
    setIsLoading(true);
    getBalance(network.name)
      .then((result) => {
        if (result && active) setBalance(result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error getting the balance');
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [network, loadWallet]);

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.ethContainer}>
        <FontAwesome5 name="ethereum" size={40} color={isDarkMode ? 'white' : 'black'} />
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={isDarkMode ? 'white' : 'black'}
            style={styles.loader}
          />
        ) : (
          <Text style={[styles.ethAmount, isDarkMode ? styles.darkText : styles.lightText]}>
            {balance} {network?.symbol}
          </Text>
        )}
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
  loader: {
    marginLeft: 10,
  },
});

export default BalanceDisplay;
