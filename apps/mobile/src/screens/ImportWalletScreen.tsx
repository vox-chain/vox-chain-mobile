import { Ionicons } from '@expo/vector-icons';
import { getEnrolledLevelAsync, hasHardwareAsync } from 'expo-local-authentication';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useWallet } from '../context/WalletContext';
import { useToast } from '../hooks/useToast';
import { sleep } from '../lib/utils';
import { type RootStackScreenProps } from '../navigation/types';

const ImportWalletScreen = ({ navigation }: RootStackScreenProps<'ImportWalletScreen'>) => {
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [unlockWithFaceID, setUnlockWithFaceID] = useState(false);
  const [mnemonicPhrase, setMnemonicPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { restoreFromPhrase } = useWallet();

  const handleSubmit = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'Home' } }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Image style={styles.logo} source={require('../../assets/Logo 2.png')} />
      </View>
      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <Text className="text-foreground" style={styles.label}>
            Secret Recovery Phrase
          </Text>
          <TouchableOpacity
            onPress={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
            style={styles.showButton}
            disabled={loading}
          >
            <Text style={styles.showButtonText}>Show</Text>
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              value={mnemonicPhrase}
              className="text-foreground placeholder-gray-500"
              style={styles.input}
              placeholder="Enter your Secret Recovery Phrase"
              secureTextEntry={!showRecoveryPhrase}
              onChangeText={setMnemonicPhrase}
            />
            <Ionicons name="qr-code-outline" size={24} color="gray" style={styles.qrIcon} />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text className="text-foreground" style={styles.label}>
            New Password
          </Text>
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
            style={styles.showButton}
            disabled={loading}
          >
            <Text style={styles.showButtonText}>Show</Text>
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your New Password"
              secureTextEntry={!showNewPassword}
            />
          </View>
          <Text style={styles.passwordHint}>Must be at least 8 characters</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text className="text-foreground" style={styles.label}>
            Confirm password
          </Text>
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
            style={styles.showButton}
          >
            <Text style={styles.showButtonText}>Show</Text>
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry={!showRecoveryPhrase}
            />
          </View>
        </View>
      </View>
      <View style={styles.switchContainer}>
        <Text className="text-foreground" style={styles.switchLabel}>
          Unlock with Face ID?
        </Text>
        <Switch
          value={unlockWithFaceID}
          onValueChange={setUnlockWithFaceID}
          trackColor={{ false: '#767577', true: '#f5002d' }}
          thumbColor={unlockWithFaceID ? '#ffffff' : '#f5002d'}
        />
      </View>

      <TouchableOpacity style={styles.importButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator className="m-auto" size="small" color="white" />
        ) : (
          <Text style={styles.importButtonText}>IMPORT</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By proceeding, you agree to these <Text style={styles.termsLink}>Terms and Conditions</Text>
        .
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputsContainer: {
    marginTop: 30,
  },
  inputContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 17,
    marginBottom: 10,
    marginTop: 10,
  },
  showButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  showButtonText: {
    color: '#F20530',
    marginTop: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  qrIcon: {
    padding: 10,
  },
  passwordHint: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 20,
  },
  switchLabel: {
    fontSize: 16,
  },
  importButton: {
    backgroundColor: '#F20530',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  importButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'gray',
  },
  termsLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  container2: {
    margin: 20,
  },
  logo: {
    width: 260,
    height: 35,
    margin: 'auto',
  },
});

export default ImportWalletScreen;
