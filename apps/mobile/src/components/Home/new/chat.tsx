import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Easing, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import UserInputModule from './input-module';

type TransactionDetails = {
  chain: string;
  action: string;
  recipient: string;
  amount: string;
  message: string;
  fee: string;
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
        <Icon name="loading" size={24} color="#2ECC40" />
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
        'https://d4e5-41-249-246-117.ngrok-free.app/IntentMaker',
        input,
        {
          headers: {
            'Content-Type': 'application/json',
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
        <View style={styles.headerLeft}>
          <Icon name="home" size={24} color="#000" style={styles.headerIcon} />
          <Text style={styles.headerText}>Home</Text>
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : !showConfirmation ? (
        <View style={styles.mainContent}>
          <Text style={styles.title}>What would you like to do today?</Text>
          <UserInputModule onInputSubmit={handleInputSubmit} />
          <View style={styles.examplesCard}>
            <Text style={styles.examplesTitle}>Examples</Text>
            <View style={styles.exampleItem}>
              <Icon name="send" size={20} color="#6C757D" />
              <Text style={styles.exampleText}>"Send 4 ETH to David"</Text>
            </View>
            <View style={styles.exampleItem}>
              <Icon name="swap-horizontal" size={20} color="#6C757D" />
              <Text style={styles.exampleText}>"Swap 10 ETH to BTC"</Text>
            </View>
            <View style={styles.exampleItem}>
              <Icon name="wrap" size={20} color="#6C757D" />
              <Text style={styles.exampleText}>"Wrap 5 ETH"</Text>
            </View>
            <View style={styles.exampleItem}>
              <Icon name="wrap-disabled" size={20} color="#6C757D" />
              <Text style={styles.exampleText}>"Unwrap 12 ETH"</Text>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.confirmationContainer}>
          <Text style={styles.confirmationTitle}>Would you like to proceed?</Text>
          
          <View style={styles.userInputCard}>
            <Text style={styles.userInputText}>{userInputText}</Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.cardHeader}>
              <Icon name="card-account-details-outline" size={24} color="#e60000" />
              <Text style={styles.cardTitle}>Details</Text>
            </View>

            {transactionDetails && (
              <View style={styles.detailsContent}>
                <View style={styles.detailRow}>
                  <Icon name="link-variant" size={20} color="#6C757D" />
                  <Text style={styles.detailLabel}>Chain:</Text>
                  <Text style={styles.detailValue}>{transactionDetails.chain}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="gesture-tap" size={20} color="#6C757D" />
                  <Text style={styles.detailLabel}>Action:</Text>
                  <Text style={styles.detailValue}>{transactionDetails.action}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="account" size={20} color="#6C757D" />
                  <Text style={styles.detailLabel}>Recipient:</Text>
                  <Text style={styles.detailValue}>{transactionDetails.recipient}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="currency-eth" size={20} color="#6C757D" />
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>{transactionDetails.amount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="gas-station" size={20} color="#6C757D" />
                  <Text style={styles.detailLabel}>Gas Fee:</Text>
                  <Text style={styles.detailValue}>{transactionDetails.fee}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={confirmTransaction}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={cancelTransaction}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  mainContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
  },
  examplesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exampleText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#495057',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#495057',
  },
  confirmationContainer: {
    padding: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 30,
  },
  userInputCard: {
    backgroundColor: '#f0e6e7',
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    marginRight: 12,
  },
  userInputText: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 8,
  },
  detailsContent: {
    gap: 12,
  },
  extractedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ECC4015',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    marginLeft: 8,
    color: '#2ECC40',
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  detailLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6C757D',
    width: 80,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  confirmButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#50C878',
    padding: 12,
    borderRadius: 8,
    margin: 8,
    width: 160,
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e60000',
    padding: 12,
    borderRadius: 8,
    margin: 8,
    width: 160,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Chat;