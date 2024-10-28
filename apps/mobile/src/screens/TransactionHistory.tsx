import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const STORAGE_KEY = '@transactions_history';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'completed', 'failed'
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for newest first

  const searchInputRef = useRef(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      // Simulated data - replace with your actual API call
      const mockTransactions = [
        {
          id: '1',
          type: 'send',
          amount: '4',
          token: 'ETH',
          recipient: 'David',
          recipientAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          status: 'completed',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          hash: '0x123...abc',
          gasFee: '0.002 ETH',
          intentSource: 'voice',
          originalIntent: 'Send 4 ETH to David',
        },
        {
          id: '2',
          type: 'swap',
          amount: '1000',
          token: 'USDC',
          toAmount: '0.5',
          toToken: 'ETH',
          status: 'pending',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          hash: '0x456...def',
          gasFee: '0.003 ETH',
          intentSource: 'text',
          originalIntent: 'Swap 1000 USDC to ETH',
        },
        // Add more mock transactions as needed
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'send':
        return 'send';
      case 'swap':
        return 'swap-horizontal';
      case 'wrap':
        return 'wrap';
      case 'unwrap':
        return 'unwrap';
      default:
        return 'application';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'failed':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const filteredTransactions = transactions
    .filter((tx) => {
      const matchesSearch =
        tx.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.recipientAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.originalIntent?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterStatus === 'all' || tx.status === filterStatus;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      return sortOrder === 'desc'
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp);
    });

  const TransactionCard = ({ transaction }) => {
    const isSelected = selectedTransaction?.id === transaction.id;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedTransaction(isSelected ? null : transaction);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#ffffff', '#ffffff']}
          style={[styles.transactionCard, isSelected && styles.selectedCard]}
        >
          <View style={styles.transactionHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${getStatusColor(transaction.status)}15` },
              ]}
            >
              <Icon
                name={getTransactionIcon(transaction.type)}
                size={24}
                color={getStatusColor(transaction.status)}
              />
            </View>

            <View style={styles.transactionDetails}>
              <Text style={styles.transactionType}>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </Text>
              <Text style={styles.transactionAmount}>
                {transaction.amount} {transaction.token}
                {transaction.toAmount && ` → ${transaction.toAmount} ${transaction.toToken}`}
              </Text>
              <Text style={styles.transactionTimestamp}>
                {formatTimestamp(transaction.timestamp)}
              </Text>
            </View>

            <View style={styles.statusContainer}>
              <Icon
                name={transaction.intentSource === 'voice' ? 'microphone' : 'text'}
                size={16}
                color="#666"
                style={styles.intentIcon}
              />
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(transaction.status) },
                ]}
              >
                <Text style={styles.statusText}>{transaction.status}</Text>
              </View>
            </View>
          </View>

          {isSelected && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedTitle}>Transaction Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Original Intent:</Text>
                <Text style={styles.detailValue}>{transaction.originalIntent}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Recipient:</Text>
                <Text style={styles.detailValue}>
                  {transaction.recipient && `${transaction.recipient} (`}
                  {transaction.recipientAddress}
                  {transaction.recipient && ')'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction Hash:</Text>
                <Text style={styles.detailValue}>{transaction.hash}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gas Fee:</Text>
                <Text style={styles.detailValue}>{transaction.gasFee}</Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[styles.filterButton, filterStatus === value && styles.activeFilter]}
      onPress={() => setFilterStatus(value)}
    >
      <Icon
        name={
          value === 'all'
            ? 'format-list-bulleted'
            : value === 'completed'
              ? 'check-circle'
              : value === 'pending'
                ? 'clock-outline'
                : 'alert-circle'
        }
        size={20}
        color={filterStatus === value ? '#fff' : '#e60000'}
      />
      <Text style={[styles.filterText, filterStatus === value && styles.activeFilterText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e60000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.header2}>
          <MaterialIcons style={styles.headerIcon} name="history-edu" size={25} color="black" />
          <Text style={styles.headerTitle}>Your Transactions</Text>
        </View>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Icon
            name={sortOrder === 'desc' ? 'sort-calendar-descending' : 'sort-calendar-ascending'}
            size={24}
            color="#e60000"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearSearch} onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <FilterButton label="All" value="all" />
        <FilterButton label="Completed" value="completed" />
        <FilterButton label="Pending" value="pending" />
        <FilterButton label="Failed" value="failed" />
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="history" size={48} color="#ccc" />
            <Text style={styles.emptyMessage}>
              {searchQuery ? 'No transactions found matching your search' : 'No transactions yet'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
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
  header2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  headerIcon: {
    marginRight: 5,
  },

  sortButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212529',
  },
  clearSearch: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e60000',
  },
  activeFilter: {
    backgroundColor: '#e60000',
  },
  filterText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#e60000',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 16,
  },
  transactionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    borderColor: '#e60000',
    borderWidth: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#495057',
    marginTop: 2,
  },
  transactionTimestamp: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  intentIcon: {
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    width: 120,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#6C757D',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 32,
  },
  emptyMessage: {
    marginTop: 12,
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
});

// utility functions
const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatAmount = (amount, decimals = 4) => {
  if (!amount) return '0';
  return parseFloat(amount).toFixed(decimals);
};

// Add this component above the TransactionHistory component
const TransactionDetailsModal = ({ transaction, visible, onClose }) => {
  if (!visible || !transaction) return null;

  return (
    <View style={modalStyles.container}>
      <BlurView style={modalStyles.backdrop} intensity={90} tint="dark">
        <Animated.View style={modalStyles.content}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Transaction Details</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Icon name="close" size={24} color="#e60000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={modalStyles.scrollContent}>
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Basic Information</Text>
              <View style={modalStyles.infoRow}>
                <Text style={modalStyles.label}>Type</Text>
                <Text style={modalStyles.value}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Text>
              </View>
              <View style={modalStyles.infoRow}>
                <Text style={modalStyles.label}>Status</Text>
                <View
                  style={[
                    modalStyles.statusBadge,
                    { backgroundColor: getStatusColor(transaction.status) },
                  ]}
                >
                  <Text style={modalStyles.statusText}>{transaction.status}</Text>
                </View>
              </View>
              <View style={modalStyles.infoRow}>
                <Text style={modalStyles.label}>Timestamp</Text>
                <Text style={modalStyles.value}>{formatTimestamp(transaction.timestamp)}</Text>
              </View>
            </View>

            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Transaction Details</Text>
              <View style={modalStyles.infoRow}>
                <Text style={modalStyles.label}>Amount</Text>
                <Text style={modalStyles.value}>
                  {formatAmount(transaction.amount)} {transaction.token}
                  {transaction.toAmount && (
                    <>
                      {' → '}
                      {formatAmount(transaction.toAmount)} {transaction.toToken}
                    </>
                  )}
                </Text>
              </View>
              <View style={modalStyles.infoRow}>
                <Text style={modalStyles.label}>Gas Fee</Text>
                <Text style={modalStyles.value}>{transaction.gasFee}</Text>
              </View>
            </View>

            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Recipient Information</Text>
              <View style={modalStyles.infoRow}>
                <Text style={modalStyles.label}>Name</Text>
                <Text style={modalStyles.value}>{transaction.recipient || 'N/A'}</Text>
              </View>
              <View style={modalStyles.infoRow}>
                <Text style={modalStyles.label}>Address</Text>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(transaction.recipientAddress);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={modalStyles.copyButton}
                >
                  <Text style={modalStyles.addressText}>{transaction.recipientAddress}</Text>
                  <Icon name="content-copy" size={16} color="#e60000" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Intent Information</Text>
              <View style={modalStyles.infoRow}>
                <Text style={modalStyles.label}>Source</Text>
                <View style={modalStyles.intentSourceContainer}>
                  <Icon
                    name={transaction.intentSource === 'voice' ? 'microphone' : 'text'}
                    size={16}
                    color="#666"
                  />
                  <Text style={modalStyles.value}>
                    {transaction.intentSource === 'voice' ? 'Voice Command' : 'Text Input'}
                  </Text>
                </View>
              </View>
              <View style={modalStyles.infoRow}>
                <Text style={modalStyles.label}>Original Intent</Text>
                <Text style={modalStyles.value}>{transaction.originalIntent}</Text>
              </View>
            </View>

            {transaction.status === 'completed' && (
              <TouchableOpacity
                style={modalStyles.viewExplorerButton}
                onPress={() => {
                  // Implement blockchain explorer link
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Icon name="open-in-new" size={20} color="#fff" />
                <Text style={modalStyles.viewExplorerText}>View in Explorer</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Animated.View>
      </BlurView>
    </View>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: width - 32,
    maxHeight: height * 0.8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  closeButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#6C757D',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#212529',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  addressText: {
    fontSize: 14,
    color: '#212529',
    marginRight: 8,
  },
  intentSourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  viewExplorerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e60000',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  viewExplorerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TransactionHistory;
