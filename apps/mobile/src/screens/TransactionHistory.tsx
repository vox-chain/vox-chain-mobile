import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';

import { useNetworkContext } from '../context/NetworkContext';
import { useWallet } from '../context/WalletContext';

const ETHERSCAN_API_KEY = 'TVJ2BU51W5YGBZY6QDPZ5KP6R9X173DDC5';

const TransactionHistory: React.FC = () => {
  const { address } = useWallet();
  const { network } = useNetworkContext();
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTransactionHistory = async (apiUrl: string | undefined) => {
      if (!address) {
        Alert.alert('Error', 'Could not find wallet address.');
        return;
      }
      if (!apiUrl) {
        Alert.alert('Error', 'API URL is not defined.');
        return;
      }

      setLoading(true);
      setTransactionHistory([]);
      try {
        const response = await axios.get(apiUrl, {
          params: {
            module: 'account',
            action: 'txlist',
            address,
            startblock: 0,
            endblock: 99999999,
            sort: 'asc',
            apikey: ETHERSCAN_API_KEY,
          },
        });

        if (response.data.status === '1') {
          setTransactionHistory(response.data.result);
        }
        // } else {
        //   Alert.alert('Error', response.data.message);
        // }
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        Alert.alert('Error', 'An error occurred while fetching the transaction history.');
      } finally {
        setLoading(false);
      }
    };
    if (network?.apiUrl) {
      fetchTransactionHistory(network.apiUrl);
    }
  }, [network?.apiUrl, address]);

  const formatTransactionValue = (value: string): string => {
    const convertedValue = parseFloat(value) / 1e18;
    return `${convertedValue.toFixed(4)} ${network?.symbol}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        Transaction History
      </Text>
      <View
        style={{
          height: 1,
          backgroundColor: '#ccc', // Light grey line
          marginBottom: 16, // Space between the line and the content below
        }}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : transactionHistory.length === 0 ? (
        <Text style={{ textAlign: 'center', fontSize: 16 }}>
          No transactions yet on {network?.name}.
        </Text>
      ) : (
        <ScrollView style={{ width: '100%' }}>
          {transactionHistory.map((tx, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ color: '#333', marginBottom: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>From:</Text> {tx.from}
              </Text>
              <Text style={{ color: '#333', marginBottom: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>To:</Text> {tx.to}
              </Text>
              <Text style={{ color: '#333', marginBottom: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>Value:</Text>{' '}
                {formatTransactionValue(tx.value)}
              </Text>
              <Text style={{ color: '#333' }}>
                <Text style={{ fontWeight: 'bold' }}>Date:</Text>{' '}
                {new Date(tx.timeStamp * 1000).toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default TransactionHistory;

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
// import axios from 'axios';
// import { useWallet } from '../context/WalletContext';

// // ETHERSCAN_API_KEY is an etherscan key . I used the Etherscan API to retrieve the transaction data for a given wallet address.

// const ETHERSCAN_API_KEY = 'TVJ2BU51W5YGBZY6QDPZ5KP6R9X173DDC5';

// const ETHERSCAN_API_URL = 'https://api-sepolia.etherscan.io/api';

// const TransactionHistory: React.FC = () => {
//   let { address } = useWallet();
//   const [transactionHistory, setTransactionHistory] = useState<any[]>([]);

//   useEffect(() => {
//     fetchTransactionHistory();
//   }, []);

//   const fetchTransactionHistory = async () => {
//     if (!address) {
//       Alert.alert('Error', 'could not find wallet address.');
//       return;
//     }

//     try {
//       const response = await axios.get(ETHERSCAN_API_URL, {
//         params: {
//           module: 'account',
//           action: 'txlist',
//           address: address,
//           startblock: 0,
//           endblock: 99999999,
//           sort: 'asc',
//           apikey: ETHERSCAN_API_KEY,
//         },
//       });

//       if (response.data.status === '1') {
//         setTransactionHistory(response.data.result);
//       } else {
//         Alert.alert('Error', response.data.message);
//       }
//     } catch (error) {
//       console.error('Error fetching transaction history:', error);
//       Alert.alert(
//         'Error',
//         'An error occurred while fetching the transaction history.',
//       );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.paragraph}>📜 Transaction History 📜</Text>
//       <ScrollView style={styles.scrollView}>
//         {transactionHistory.map((tx, index) => (
//           <View key={index} style={styles.transactionContainer}>
//             <Text style={styles.transactionText}>Hash: {tx.hash}</Text>
//             <Text style={styles.transactionText}>From: {tx.from}</Text>
//             <Text style={styles.transactionText}>To: {tx.to}</Text>
//             <Text style={styles.transactionText}>Value: {tx.value} Wei</Text>
//             <Text style={styles.transactionText}>Block: {tx.blockNumber}</Text>
//             <Text style={styles.transactionText}>
//               Timestamp: {new Date(tx.timeStamp * 1000).toLocaleString()}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 20,
//   },
//   paragraph: {
//     marginTop: 20,
//     marginBottom: 10,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   scrollView: {
//     width: '100%',
//   },
//   transactionContainer: {
//     marginTop: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//   },
//   transactionText: {
//     fontSize: 14,
//   },
// });

// export default TransactionHistory;
