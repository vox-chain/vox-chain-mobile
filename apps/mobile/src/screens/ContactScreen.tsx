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
  Alert,
  StyleSheet,
  SectionList,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const STORAGE_KEY = '@contacts_storage';
const { width } = Dimensions.get('window');

const ContactsManager = () => {
  interface Contact {
    id: string;
    name: string;
    address: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    isFavorite: boolean;
  }

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', notes: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingContactId, setEditingContactId] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedContact, setSelectedContact] = useState(null);

  const modalY = useRef(new Animated.Value(1000)).current;
  const searchInputRef = useRef(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    saveContacts();
  }, [contacts]);

  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const saveContacts = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (error) {
      Alert.alert('Error', 'Failed to save contacts');
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(modalY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeModal = () => {
    Animated.spring(modalY, {
      toValue: 1000,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start(() => {
      setModalVisible(false);
      resetForm();
    });
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', notes: '' });
    setIsEditing(false);
    setEditingContactId(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return false;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.address)) {
      Alert.alert('Validation Error', 'Invalid Ethereum address');
      return false;
    }
    return true;
  };

  const handleSaveContact = () => {
    if (!validateForm()) return;

    const timestamp = new Date().toISOString();

    if (isEditing && editingContactId) {
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === editingContactId
            ? { ...formData, id: contact.id, updatedAt: timestamp }
            : contact
        )
      );
    } else {
      const newContact = {
        ...formData,
        id: Date.now().toString(),
        createdAt: timestamp,
        updatedAt: timestamp,
        isFavorite: false,
      };
      setContacts([newContact, ...contacts]);
    }

    closeModal();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteContact = (contactId) => {
    Alert.alert('Delete Contact', 'Are you sure you want to delete this contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setContacts(contacts.filter((c) => c.id !== contactId));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const handleEditContact = (contact) => {
    setFormData({
      name: contact.name,
      address: contact.address,
      notes: contact.notes || '',
    });
    setEditingContactId(contact.id);
    setIsEditing(true);
    openModal();
  };

  const toggleFavorite = (contactId) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, isFavorite: !contact.isFavorite } : contact
      )
    );
  };

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => {
      const newOrder = prevOrder === 'asc' ? 'desc' : 'asc';
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return newOrder;
    });
  };

  const groupedContacts = () => {
    const filteredContacts = contacts
      .filter((contact) => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (showFavorites) return contact.isFavorite && matchesSearch;
        return matchesSearch;
      })
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        const comparison =
          sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        return comparison;
      });

    const grouped = filteredContacts.reduce((groups, contact) => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
      return groups;
    }, {});

    const sections = Object.keys(grouped)
      .sort((a, b) => (sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)))
      .map((letter) => ({
        title: letter,
        data: grouped[letter],
      }));

    return sections;
  };

  const ContactCard = ({ contact }) => {
    const swipeableRef = useRef(null);

    const rightSwipeActions = () => (
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={[styles.swipeAction, styles.editAction]}
          onPress={() => {
            swipeableRef.current?.close();
            handleEditContact(contact);
          }}
        >
          <Icon name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.swipeAction, styles.deleteAction]}
          onPress={() => {
            swipeableRef.current?.close();
            handleDeleteContact(contact.id);
          }}
        >
          <Icon name="delete-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={rightSwipeActions}
        friction={2}
        rightThreshold={40}
      >
        <TouchableOpacity
          onPress={() => setSelectedContact(selectedContact?.id === contact.id ? null : contact)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={contact.isFavorite ? ['#FF6B6B22', '#FFE66D22'] : ['#ffffff', '#ffffff']}
            style={[styles.contactCard, selectedContact?.id === contact.id && styles.selectedCard]}
          >
            <View style={styles.contactHeader}>
              <View style={styles.contactInitialContainer}>
                <Text style={styles.contactInitial}>{contact.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactAddress}>
                  {`${contact.address.substring(0, 6)}...${contact.address.slice(-4)}`}
                </Text>
                {contact.notes && (
                  <Text style={styles.contactNotes} numberOfLines={1}>
                    {contact.notes}
                  </Text>
                )}
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity
                  onPress={() => toggleFavorite(contact.id)}
                  style={styles.actionButton}
                >
                  <Icon
                    name={contact.isFavorite ? 'star-shooting' : 'star-outline'}
                    size={24}
                    color="#e60000"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(contact.address);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Copied!', 'Address copied to clipboard');
                  }}
                  style={styles.actionButton}
                >
                  <Icon name="content-copy" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
            {selectedContact?.id === contact.id && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedTitle}>Full Address:</Text>
                <Text style={styles.expandedAddress}>{contact.address}</Text>
                {contact.notes && (
                  <>
                    <Text style={styles.expandedTitle}>Notes:</Text>
                    <Text style={styles.expandedNotes}>{contact.notes}</Text>
                  </>
                )}
                <Text style={styles.timestamp}>
                  Last updated: {new Date(contact.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.header2}>
          <MaterialIcons style={styles.headerIcon} name="contacts" size={22} color="black" />
          <Text style={styles.headerTitle}>Your Contacts</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.sortButton} onPress={handleSortToggle}>
            <Icon
              name={
                sortOrder === 'asc' ? 'sort-alphabetical-ascending' : 'sort-alphabetical-descending'
              }
              size={24}
              color="#e60000"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={openModal}>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search contacts..."
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
        <TouchableOpacity
          style={[styles.filterButton, !showFavorites && styles.activeFilter]}
          onPress={() => setShowFavorites(false)}
        >
          <Icon
            name="account-supervisor-circle"
            size={20}
            color={!showFavorites ? '#fff' : '#e60000'}
          />
          <Text style={[styles.filterText, !showFavorites && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, showFavorites && styles.activeFilter]}
          onPress={() => setShowFavorites(true)}
        >
          <Icon name="star-shooting" size={20} color={showFavorites ? '#fff' : '#e60000'} />
          <Text style={[styles.filterText, showFavorites && styles.activeFilterText]}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={groupedContacts()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactCard contact={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="contacts" size={48} color="#ccc" />
            <Text style={styles.emptyMessage}>
              {searchQuery
                ? 'No contacts found matching your search'
                : showFavorites
                  ? 'No favorite contacts yet'
                  : 'No contacts yet'}
            </Text>
          </View>
        }
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      {isModalVisible && (
        <BlurView style={styles.modalOverlay} intensity={90} tint="dark">
          <Animated.View style={[styles.modal, { transform: [{ translateY: modalY }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Edit Contact' : 'Add Contact'}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name="close" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Icon name="account" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="ethereum" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ethereum Address"
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="note-text" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Notes (optional)"
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveContact}
                activeOpacity={0.8}
              >
                <Icon name={isEditing ? 'content-save' : 'plus-circle'} size={24} color="#fff" />
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Save Changes' : 'Add Contact'}
                </Text>
              </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    padding: 8,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#e60000',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
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
  contactCard: {
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
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInitialContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B6B15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  contactDetails: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  contactAddress: {
    fontSize: 14,
    color: '#6C757D',
  },
  contactNotes: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  expandedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  expandedAddress: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 12,
  },
  expandedNotes: {
    fontSize: 14,
    color: '#6C757D',
  },
  timestamp: {
    fontSize: 12,
    color: '#ADB5BD',
    marginTop: 8,
    textAlign: 'right',
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: '88%',
    borderRadius: 12,
    marginLeft: 8,
  },
  editAction: {
    backgroundColor: '#4dabf7',
  },
  deleteAction: {
    backgroundColor: '#e60000',
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
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212529',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e60000',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
  },
});

export default ContactsManager;
