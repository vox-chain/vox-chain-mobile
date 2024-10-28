import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  Linking,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Selection options for different settings
const OPTIONS = {
  language: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'],
  currency: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'KRW'],
  fontSize: ['Small', 'Medium', 'Large', 'Extra Large'],
  defaultNetwork: ['Ethereum', 'Binance Smart Chain', 'Polygon', 'Avalanche'],
  gasPreference: ['Standard', 'Fast', 'Rapid'],
  lockTimer: ['1', '5', '10', '15', '30'],
  slippageTolerance: ['0.1', '0.5', '1.0', '2.0', '3.0'],
};

const SettingsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: {
      pushEnabled: true,
      emailEnabled: true,
      transactionAlerts: true,
      marketingUpdates: false,
      priceAlerts: true,
      securityAlerts: true,
    },
    security: {
      biometricEnabled: false,
      twoFactorAuth: true,
      autoLock: true,
      lockTimer: '5',
      privateMode: false,
      backupEnabled: true,
    },
    display: {
      darkMode: false,
      showBalance: true,
      compactMode: false,
      highContrast: false,
      fontSize: 'medium',
    },
    network: {
      defaultNetwork: 'Ethereum',
      gasPreference: 'standard',
      slippageTolerance: '0.5',
      autoConnect: true,
    },
    privacy: {
      analytics: true,
      crashReports: true,
      personalization: false,
      shareData: false,
    },
    language: 'English',
    currency: 'USD',
  });

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState({
    type: '',
    options: [],
    category: '',
    setting: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('@settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load settings');
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('@settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const toggleSetting = (category, setting) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting],
      },
    };
    saveSettings(newSettings);
  };

  const openSelectionModal = (type, options, category = '', setting = '') => {
    setCurrentSelection({ type, options, category, setting });
    setModalVisible(true);
  };

  const handleSelection = (value) => {
    const newSettings = { ...settings };

    if (currentSelection.category) {
      newSettings[currentSelection.category] = {
        ...newSettings[currentSelection.category],
        [currentSelection.setting]: value,
      };
    } else {
      newSettings[currentSelection.type] = value;
    }

    saveSettings(newSettings);
    setModalVisible(false);
  };

  const SelectionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select {currentSelection.type}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={currentSelection.options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => handleSelection(item)}>
                <Text style={styles.modalItemText}>{item}</Text>
                {(currentSelection.category
                  ? settings[currentSelection.category][currentSelection.setting]
                  : settings[currentSelection.type]) === item && (
                  <Icon name="check" size={24} color="#e60000" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderSettingItem = ({
    icon,
    title,
    value,
    onPress,
    showToggle = false,
    description = '',
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingItemLeft}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={24} color="#64748b" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingItemTitle}>{title}</Text>
          {description ? <Text style={styles.settingDescription}>{description}</Text> : null}
        </View>
      </View>
      {showToggle ? (
        <TouchableOpacity
          style={[
            styles.customSwitch,
            value ? styles.customSwitchActive : styles.customSwitchInactive,
          ]}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.customSwitchThumb,
              value ? styles.customSwitchThumbActive : styles.customSwitchThumbInactive,
            ]}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.settingItemRight}>
          {value && <Text style={styles.settingItemValue}>{value}</Text>}
          <Icon name="chevron-right" size={24} color="#64748b" />
        </View>
      )}
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
      <SelectionModal />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => Linking.openURL('https://support.example.com')}
        >
          <Icon name="help-circle-outline" size={24} color="#e60000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {renderSettingItem({
            icon: 'bell-outline',
            title: 'Push Notifications',
            showToggle: true,
            value: settings.notifications.pushEnabled,
            onPress: () => toggleSetting('notifications', 'pushEnabled'),
          })}
          {renderSettingItem({
            icon: 'email-outline',
            title: 'Email Notifications',
            showToggle: true,
            value: settings.notifications.emailEnabled,
            onPress: () => toggleSetting('notifications', 'emailEnabled'),
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          {renderSettingItem({
            icon: 'lock-clock',
            title: 'Auto-Lock Timer',
            value: `${settings.security.lockTimer} minutes`,
            onPress: () =>
              openSelectionModal('Lock Timer', OPTIONS.lockTimer, 'security', 'lockTimer'),
          })}
          {renderSettingItem({
            icon: 'shield-check-outline',
            title: 'Two-Factor Authentication',
            showToggle: true,
            value: settings.security.twoFactorAuth,
            onPress: () => toggleSetting('security', 'twoFactorAuth'),
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>
          {renderSettingItem({
            icon: 'format-font-size-increase',
            title: 'Font Size',
            value: settings.display.fontSize,
            onPress: () => openSelectionModal('Font Size', OPTIONS.fontSize, 'display', 'fontSize'),
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network</Text>
          {renderSettingItem({
            icon: 'ethereum',
            title: 'Default Network',
            value: settings.network.defaultNetwork,
            onPress: () =>
              openSelectionModal('Network', OPTIONS.defaultNetwork, 'network', 'defaultNetwork'),
          })}
          {renderSettingItem({
            icon: 'gas-station',
            title: 'Gas Preference',
            value: settings.network.gasPreference,
            onPress: () =>
              openSelectionModal(
                'Gas Preference',
                OPTIONS.gasPreference,
                'network',
                'gasPreference'
              ),
          })}
          {renderSettingItem({
            icon: 'percent',
            title: 'Slippage Tolerance',
            value: `${settings.network.slippageTolerance}%`,
            onPress: () =>
              openSelectionModal(
                'Slippage Tolerance',
                OPTIONS.slippageTolerance,
                'network',
                'slippageTolerance'
              ),
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {renderSettingItem({
            icon: 'translate',
            title: 'Language',
            value: settings.language,
            onPress: () => openSelectionModal('language', OPTIONS.language),
          })}
          {renderSettingItem({
            icon: 'currency-usd',
            title: 'Currency',
            value: settings.currency,
            onPress: () => openSelectionModal('currency', OPTIONS.currency),
          })}
        </View>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() => Alert.alert('Clear Data', 'Are you sure you want to clear all app data?')}
        >
          <Icon name="trash-can-outline" size={20} color="white" />
          <Text style={styles.dangerButtonText}>Clear App Data</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://example.com/terms')}>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://example.com/privacy')}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  helpButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    color: '#334155',
  },
  settingDescription: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemValue: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  version: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 14,
    color: '#e60000',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  customSwitch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  customSwitchActive: {
    backgroundColor: '#e60000',
  },
  customSwitchInactive: {
    backgroundColor: '#e2e8f0',
  },
  customSwitchThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  customSwitchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  customSwitchThumbInactive: {
    transform: [{ translateX: 0 }],
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalItemText: {
    fontSize: 16,
    color: '#334155',
  },
});

export default SettingsScreen;
