import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface StepOneProps {
  onNext: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ onNext }) => {
  const [PIN, setPIN] = useState<string>('');
  const [PINConf, setPINConf] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [isChecked, setChecked] = useState<boolean>(false);

  const generateWalletHandler = async () => {
    onNext();
  };
  return (
    <ScrollView style={styles.stepContainer}>
      <Text className="text-foreground" style={styles.title}>
        Create PIN:
      </Text>
      <Text className="text-foreground" style={styles.subtitle}>
        Secure your wallet's Secret Recovery Phrase.
      </Text>
      <View style={styles.inputBox}>
        <Text style={styles.textInput}>New PIN:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={(pin) => setPIN(pin)}
          value={PIN}
        />
        <Text style={styles.textInput}>Confirm PIN:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={(pin) => setPINConf(pin)}
          value={PINConf}
        />
      </View>
      <View style={styles.Togglercontainer}>
        <Text className="text-foreground" style={styles.text}>
          Unlock with Face ID?
        </Text>
        <Switch
          style={{ marginStart: 20 }}
          trackColor={{ false: '#767577', true: '#f5002d' }}
          thumbColor={isEnabled ? '#ffffff' : '#f5002d'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#F20530' : undefined}
        />
        <Text className="text-foreground" style={styles.label}>
          I understand that FeverTokens cannot recover this Pin for me.
        </Text>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={generateWalletHandler}>
        <Text style={styles.startButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputBox: {
    backgroundColor: '#F2F4F6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  textInput: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#F20530',
    marginVertical: 10,
  },
  input: {
    fontSize: 20,
    width: '100%',
    height: 50,
    borderBottomWidth: 4,
    borderRadius: 10,
    borderBottomColor: '#F20530',
    marginBottom: 10,
  },
  Togglercontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
    margin: 5,
  },
  label: {
    margin: 8,
  },
  text: {
    fontSize: 20,
    marginEnd: 20,
  },
  startButton: {
    backgroundColor: '#F20530',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 40,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StepOne;
