import { getEnrolledLevelAsync, hasHardwareAsync } from 'expo-local-authentication';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useToast } from '../hooks/useToast';
import { sleep } from '../lib/utils';
import { type RootStackScreenProps } from '../navigation/types';

import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';

const WalletSetupScreen = ({ navigation }: RootStackScreenProps<'WalletSetup'>) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

  const { createWallet } = useWallet();

  // const generateWallet = async () => {
  //   try {
  //     const wallet = ethers.Wallet.createRandom();
  //     setWalletAddress(wallet.address);
  //     setSeedPhrase(wallet.mnemonic!.phrase);
  //     console.log('Address:', wallet.address);
  //     console.log('Mnemonic:', wallet.mnemonic!.phrase);
  //     console.log('Private Key:', wallet.privateKey);
  //     // Save wallet details to secure storage
  //     await saveToSecureStore('privateKey', wallet.privateKey);
  //     await saveToSecureStore('mnemonic_phrase', wallet.mnemonic!.phrase);
  //     await saveToSecureStore('address', wallet.address);
  //   } catch (error: any) {
  //     console.error('Error generating wallet:', error.message);
  //   }
  // };
  // this method to save  wallet credentials to keystore

  const handleImportWallet = () => {
    navigation.navigate('ImportWalletScreen');
  };

  const handleCreateWallet = async () => {
    const enrolled = await getEnrolledLevelAsync();

    if (!enrolled) {
      toast.error('Phone locking is crucial for security.', {
        text1: 'Enable lock to proceed',
      });
      return;
    }

    if (enrolled === 1 && (await hasHardwareAsync()))
      toast.info('Biometrics are recomended for enhanced security.');

    setLoading(true);
    await sleep(10);
    const success = await createWallet();
    setLoading(false);
    if (success) navigation.navigate('WalletCreationForm');
  };

  return (
    <ImageBackground
      source={
        isDarkMode
          ? require('../../assets/Background2.png')
          : require('../../assets/Background.png')
      }
      style={[styles.background, isDarkMode ? styles.darkTopContainer : styles.lightTopContainer]}
    >
      <View style={[styles.topContainer]}>
        <Image style={styles.logo} source={require('../../assets/Logo 2.png')} />
        <Text style={[styles.description, isDarkMode ? styles.darkText : styles.lightText]}>
          {t('Import an existing wallet or create a new one')}
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={handleImportWallet}
          disabled={loading}
        >
          <Text style={styles.buttonTextOutline}>{t('Import using Secret Phrase')}</Text>
          <Icon name="lock-open" size={24} color="#F20530" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonFill} onPress={handleCreateWallet} disabled={loading}>
          {loading ? (
            <ActivityIndicator className="m-auto" size="small" color="white" />
          ) : (
            <>
              <Text style={styles.buttonTextFill}>{t('Create a new wallet')}</Text>
              <Icon name="add-circle-outline" size={24} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  lightTopContainer: {
    backgroundColor: 'transparent',
  },
  darkTopContainer: {
    backgroundColor: 'rgba(51, 51, 51, 0.7)', // Semi-transparent dark background
  },
  logo: {
    width: 350,
    height: 45,
    marginBottom: 20,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  lightText: {
    color: 'black',
  },
  darkText: {
    color: 'white',
  },
  bottomContainer: {
    marginBottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F20530',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: 300,
    marginBottom: 20,
  },
  buttonFill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F20530',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: 300,
    height: 55,
  },
  buttonTextOutline: {
    color: '#F20530',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextFill: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WalletSetupScreen;
