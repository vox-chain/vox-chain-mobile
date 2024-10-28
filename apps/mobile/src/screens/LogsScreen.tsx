import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Alert,
  StyleSheet,
  SectionList,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const STORAGE_KEY = '@logs_storage';

const LogsScreen = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const detailsY = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const storedLogs = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      } else {
        // Sample data for demonstration
        const sampleLogs = generateSampleLogs();
        setLogs(sampleLogs);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleLogs));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleLogs = () => {
    const types = ['error', 'warning', 'info', 'success'];
    const messages = [
      'Application started successfully',
      'Database connection failed',
      'User authentication attempt',
      'API request completed',
      'Cache cleared automatically',
    ];

    return Array.from({ length: 20 }, (_, i) => ({
      id: i.toString(),
      type: types[Math.floor(Math.random() * types.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      details: {
        duration: Math.floor(Math.random() * 1000) + 'ms',
        source: 'System',
        stackTrace: 'at Function.Module._load (module.js:312:12)',
      },
    }));
  };

  const showDetails = (log) => {
    setSelectedLog(log);
    setIsDetailsVisible(true);
    Animated.spring(detailsY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const hideDetails = () => {
    Animated.spring(detailsY, {
      toValue: 1000,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start(() => {
      setIsDetailsVisible(false);
      setSelectedLog(null);
    });
  };

  const getLogTypeIcon = (type) => {
    switch (type) {
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'alert';
      case 'success':
        return 'check-circle';
      default:
        return 'information';
    }
  };

  const getLogTypeColor = (type) => {
    switch (type) {
      case 'error':
        return '#FF4444';
      case 'warning':
        return '#FFBB33';
      case 'success':
        return '#00C851';
      default:
        return '#33B5E5';
    }
  };

  const groupLogsByDate = () => {
    const filtered = logs.filter((log) => {
      const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || log.type === filterType;
      return matchesSearch && matchesFilter;
    });

    const grouped = filtered.reduce((groups, log) => {
      const date = new Date(log.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
      return groups;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .map((date) => ({
        title: date,
        data: grouped[date].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
      }));
  };

  const LogCard = ({ log }) => (
    <TouchableOpacity onPress={() => showDetails(log)} activeOpacity={0.7}>
      <LinearGradient colors={[`${getLogTypeColor(log.type)}11`, '#ffffff']} style={styles.logCard}>
        <View style={styles.logHeader}>
          <View style={[styles.logTypeIcon, { backgroundColor: `${getLogTypeColor(log.type)}22` }]}>
            <Icon name={getLogTypeIcon(log.type)} size={20} color={getLogTypeColor(log.type)} />
          </View>
          <View style={styles.logContent}>
            <Text style={styles.logMessage} numberOfLines={2}>
              {log.message}
            </Text>
            <Text style={styles.logTimestamp}>{new Date(log.timestamp).toLocaleTimeString()}</Text>
          </View>
        </View>
      </LinearGradient>
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
          <Icon style={styles.headerIcon} name="math-log" size={28} color="black" />
          <Text style={styles.headerTitle}>Your Contacts</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={loadLogs}>
          <Icon name="refresh" size={24} color="#e60000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search logs..."
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
        {['all', 'error', 'warning', 'info', 'success'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filterType === type && styles.activeFilter,
              filterType === type && {
                backgroundColor: type === 'all' ? '#e60000' : getLogTypeColor(type),
              },
            ]}
            onPress={() => setFilterType(type)}
          >
            {type !== 'all' && (
              <Icon
                name={getLogTypeIcon(type)}
                size={16}
                color={filterType === type ? '#fff' : getLogTypeColor(type)}
              />
            )}
            <Text style={[styles.filterText, filterType === type && styles.activeFilterText]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={groupLogsByDate()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LogCard log={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="text-box-search-outline" size={48} color="#ccc" />
            <Text style={styles.emptyMessage}>
              {searchQuery
                ? 'No logs found matching your search'
                : filterType !== 'all'
                  ? `No ${filterType} logs found`
                  : 'No logs available'}
            </Text>
          </View>
        }
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      {isDetailsVisible && (
        <BlurView style={styles.detailsOverlay} intensity={90} tint="dark">
          <Animated.View style={[styles.detailsModal, { transform: [{ translateY: detailsY }] }]}>
            <View style={styles.detailsHeader}>
              <View style={styles.detailsHeaderContent}>
                <Icon
                  name={getLogTypeIcon(selectedLog.type)}
                  size={24}
                  color={getLogTypeColor(selectedLog.type)}
                />
                <Text style={styles.detailsTitle}>Log Details</Text>
              </View>
              <TouchableOpacity onPress={hideDetails} style={styles.closeButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsContent}>
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Type</Text>
                <Text style={[styles.detailsValue, { color: getLogTypeColor(selectedLog.type) }]}>
                  {selectedLog.type.toUpperCase()}
                </Text>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Message</Text>
                <Text style={styles.detailsValue}>{selectedLog.message}</Text>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Timestamp</Text>
                <Text style={styles.detailsValue}>
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </Text>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Duration</Text>
                <Text style={styles.detailsValue}>{selectedLog.details.duration}</Text>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Source</Text>
                <Text style={styles.detailsValue}>{selectedLog.details.source}</Text>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Stack Trace</Text>
                <Text style={styles.stackTrace}>{selectedLog.details.stackTrace}</Text>
              </View>
            </View>
          </Animated.View>
        </BlurView>
      )}
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

  refreshButton: {
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
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  activeFilter: {
    borderWidth: 0,
  },
  filterText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#495057',
  },
  activeFilterText: {
    color: '#fff',
  },
  logCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logContent: {
    flex: 1,
  },
  logMessage: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 4,
  },
  logTimestamp: {
    fontSize: 12,
    color: '#6C757D',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyMessage: {
    marginTop: 12,
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  detailsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  detailsModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  detailsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
  },
  detailsContent: {
    padding: 16,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 16,
    color: '#212529',
  },
  stackTrace: {
    fontSize: 14,
    color: '#495057',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default LogsScreen;
