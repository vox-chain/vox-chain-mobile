import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import UserInputModule from './input-module';

type TransactionDetails = {
  chain: string;
  action: string;
  recipient: string;
  amount: string;
  message: string;
};

const LoadingSpinner = () => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Icon name="circle-o-notch" size={24} color="#2ECC40" />
      </Animated.View>
      <Text style={styles.loadingText}>Processing your request...</Text>
    </View>
  );
};

const Chat = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [userInputText, setUserInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'http://127.0.0.1:5000/ExecuteTransaction';

  const handleInputSubmit = async (input: string) => {
    setUserInputText(input);
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://945a-197-253-249-215.ngrok-free.app/IntentMaker',
        input,
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to extract intent.');
      }

      const data = response.data;
      console.log(data);

      setTransactionDetails({
        chain: data.intent.chain,
        action: data.intent.intent.transaction_type,
        recipient: data.intent.intent.to,
        amount: `${data.intent.intent.amount}`,
        message: data.message,
      });

      setShowConfirmation(true);
    } catch (error) {
      Alert.alert('Error', 'Could not process your input. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmTransaction = async () => {
    if (!transactionDetails) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction: {
            to: transactionDetails.recipient,
            value: transactionDetails.amount,
            chain: transactionDetails.chain,
            action: transactionDetails.action,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute transaction.');
      }

      const data = await response.json();
      Alert.alert('Success', `Transaction executed successfully. Receipt: ${data.receipt}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to execute transaction. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setTransactionDetails(null);
      setUserInputText('');
    }
  };

  const cancelTransaction = () => {
    setShowConfirmation(false);
    setTransactionDetails(null);
    setUserInputText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="home" size={24} color="black" />
        <Text style={styles.headerText}>Home</Text>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : !showConfirmation ? (
        <>
          <Text style={styles.title}>What would you like to do today?</Text>
          <UserInputModule onInputSubmit={handleInputSubmit} />
          <Text style={styles.helpText}>
            Examples :{'\n\n'} "Send 4 ETH to David" {'\n'} "Swap 10 ETH to BTC" {'\n'} "Wrap 5 ETH"
            {'\n'} "Unwrap 12 ETH"
          </Text>
        </>
      ) : (
        <View>
          <Text style={styles.confirmationSubtitle}>Would you like to proceed?</Text>
          <View style={styles.card}>
            <Text style={styles.userText}>{userInputText}</Text>
          </View>
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationTitle}>AI Intent Extraction</Text>

            {transactionDetails && (
              <>
                <View style={styles.extractedTextContainer}>
                  <Text>{transactionDetails.message}</Text>
                </View>
                <Text>Chain: {transactionDetails.chain}</Text>
                <Text>Action: {transactionDetails.action}</Text>
                <Text>Recipient: {transactionDetails.recipient}</Text>
                <Text>Amount: {transactionDetails.amount}</Text>
              </>
            )}
            <TouchableOpacity style={styles.confirmButton} onPress={confirmTransaction}>
              <Text style={styles.confirmButtonText}>Confirm Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelTransaction}>
              <Text style={styles.cancelButtonText}>Cancel Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 15,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 5,
    minHeight: 100,
    backgroundColor: '#f5fcfc',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 20,
  },
  userText: {
    alignItems: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  helpText: {
    marginTop: 10,
    color: '#666',
  },
  confirmationContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  extractedTextContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  confirmationSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#2ECC40',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF4136', // Red background for cancel
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10, // Added margin to separate the buttons
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
});

export default Chat;
