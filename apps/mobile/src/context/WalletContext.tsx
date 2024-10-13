import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useOnboarding } from './OnboardingContext';

import { useToast } from '@/hooks/useToast';
import AsyncStore from '@/lib/AsyncStore';
import { STORAGE_KEYS } from '@/lib/constants';
import { ethers } from '@/lib/ethers';
import { getNetworkRPCURL } from '@/lib/network';
import secureStore from '@/lib/secureStore';
import { createNewWallet, restoreWalletFromPhrase } from '@/services/wallet';

interface WalletContextType {
  address: string | null;
  createWallet: () => Promise<boolean>;
  importWallet: (importedPrivateKey: string) => Promise<void>;
  transfer: (recipientAddress: string, amount: string, RPC_URL: string) => Promise<void>;
  getBalance: (network: string) => Promise<string>;
  restoreFromPhrase: (mnemonicPhrase: string) => Promise<boolean>;
  loadWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const toast = useToast();
  const { hasPrivateKey } = useOnboarding();
  const getPrivateKey = async () => await secureStore.getPrivateKey();

  const loadWallet = async () => {
    try {
      const storedAddress = await AsyncStore.getStorageValue(STORAGE_KEYS.ADDRESS);
      console.log('stored address: ', storedAddress);

      if (storedAddress) {
        setAddress(storedAddress);
        //we added  a delay to make sure wallet is loaded before the U in other components
        await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      } else throw new Error('No address found');
    } catch (error) {
      console.error('Failed to load wallet:', error);
    }
  };

  const createWallet = async () => {
    try {
      const wallet = await createNewWallet();
      toast.success('Wallet created successfully');
      console.log('Created Wallet mnemonic: ' + wallet.mnemonic?.phrase);
      await AsyncStore.setStorageValue(STORAGE_KEYS.ADDRESS, wallet.address);
      //this HAS_PRIVATE_KEY value is used in onBoardingContext
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_PRIVATE_KEY, 'true');
      setAddress(wallet.address);
      await loadWallet();
      return true;
    } catch (error: any) {
      if (error.isOperational) toast.error(error.message);
      else {
        toast.error('Failed to create wallet');
        console.error('Failed to create wallet:', error);
      }
      return false;
    }
  };

  const importWallet = async (importedPrivateKey: string) => {
    try {
      const wallet = new ethers.Wallet(importedPrivateKey);
      await secureStore.setPrivateKey(importedPrivateKey);
      //added
      await AsyncStore.setStorageValue(STORAGE_KEYS.ADDRESS, wallet.address);
      console.log('imported address', wallet.address);
      //
      setAddress(wallet.address);
      await AsyncStorage.setItem(STORAGE_KEYS.ADDRESS, wallet.address);
      // this hasPrivateKey is used in onBoarding context
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_PRIVATE_KEY, 'true');
    } catch (error) {
      console.error('Failed to import wallet:', error);
      throw error;
    }
  };

  const getProvider = async (rpcURL: string): Promise<ethers.JsonRpcProvider> => {
    const provider = new ethers.JsonRpcProvider(rpcURL);
    await Promise.race([
      provider.ready,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Provider connection timeout')), 10000)
      ),
    ]);
    return provider;
  };

  const getBalance = async (network: string): Promise<string> => {
    await loadWallet();
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    if (!address) throw new Error('can NOT get balance, No address provided');

    try {
      const rpcURL = getNetworkRPCURL(network);
      const provider = await getProvider(rpcURL);
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  };

  const createTransaction = (recipientAddress: string, amount: string) => ({
    to: recipientAddress,
    value: ethers.parseUnits(amount, 'ether'),
    gasLimit: 21000,
  });

  const confirmTransactionDetails = async (
    recipientAddress: string,
    amount: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Confirm Transaction',
        `
          Please confirm the transaction details:
  
          Recipient Address: ${recipientAddress}
          Amount: ${amount} ETH
          
          Do you want to proceed?
        `,
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => resolve(true),
          },
        ],
        { cancelable: false }
      );
    });
  };

  const transfer = async (recipientAddress: string, amount: string, RPC_URL: string) => {
    let privateKey = await getPrivateKey();
    if (!privateKey) throw new Error('Private Key not provided');

    try {
      // prompt user to confirm transaction
      const confirmed = await confirmTransactionDetails(recipientAddress, amount);
      if (confirmed) {
        const provider = await getProvider(RPC_URL);
        const wallet = new ethers.Wallet(privateKey, provider);
        const tx = await wallet.sendTransaction(createTransaction(recipientAddress, amount));
        await tx.wait();
        console.debug(`Transaction successful with hash: ${tx.hash}`);
        toast.success('Transaction successful');
        privateKey = null;
      }
      privateKey = null;
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error('Transaction failed');
    }
  };

  const restoreFromPhrase = async (mnemonicPhrase: string) => {
    try {
      const wallet = await restoreWalletFromPhrase(mnemonicPhrase);
      toast.success('Wallet restored successfully');
      setAddress(wallet.address);
      return true;
    } catch (error: any) {
      if (error.isOperational) toast.error(error.message);
      else {
        toast.error('Failed to restore wallet');
        console.error(error);
      }
      return false;
    }
  };

  useEffect(() => {
    if (hasPrivateKey) loadWallet();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        createWallet,
        importWallet,
        transfer,
        getBalance,
        restoreFromPhrase,
        loadWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};
