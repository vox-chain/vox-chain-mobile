import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import AudioRecorderComponent from './AudioRecording';

interface UserInputModuleProps {
  onInputSubmit: (inputText: string) => void;
}
const STORAGE_KEY = '@contacts_storage';

const UserInputModule: React.FC<UserInputModuleProps> = ({ onInputSubmit }) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [inputHeight, setInputHeight] = useState(40); // Initial height for the input field
  const slideAnim = useState(new Animated.Value(0))[0];
  const buttonAnim = useState(new Animated.Value(0))[0];
  const inputAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: inputText.length > 0 || isListening ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(buttonAnim, {
      toValue: inputText.length > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(inputAnim, {
      toValue: inputText.length > 0 ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [inputText, isListening]);

  const handleClearText = () => {
    setInputText('');
    setInputHeight(40); // Reset input height when text is cleared
  };

  const handleConfirm = async () => {
    if (inputText.trim()) {
      try {
        // ** the method to send the contact data with the text input (the api needs and update to handle ot) **

        // Fetch contacts data from AsyncStorage
        const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
        const contacts = storedContacts ? JSON.parse(storedContacts) : [];

        // Combine the input text and contacts data
        // const combinedData = {
        //   message: inputText,
        //   contacts,
        // };
        console.log('User Data:', JSON.stringify(contacts, null, 2));
        // Pass the combined data to the parent component
        onInputSubmit(inputText);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    }
  };
  const handleContentSizeChange = (event: { nativeEvent: { contentSize: { height: number } } }) => {
    // Adjust the input height based on content size (allows growing with more lines)
    setInputHeight(Math.max(40, event.nativeEvent.contentSize.height));
  };

  const handleTranscriptionComplete = (transcription: string) => {
    if (transcription.trim()) {
      setInputText(transcription); // Update input field with transcription
    }
  };

  const inputTranslateY = inputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const buttonOpacity = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const buttonScale = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <View style={styles.card}>
      <Animated.View
        style={[styles.inputWrapper, { transform: [{ translateY: inputTranslateY }] }]}
      >
        <TextInput
          style={[styles.input, { height: inputHeight }]} // Dynamic height for TextInput
          placeholder="Your command..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline={true}
          onContentSizeChange={handleContentSizeChange} // Handle resizing
        />
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.audioButtonWrapper]}>
          <AudioRecorderComponent onTranscriptionComplete={handleTranscriptionComplete} />
        </Animated.View>

        {inputText.length > 0 && (
          <Animated.View
            style={[
              styles.buttonsWrapper,
              { opacity: buttonOpacity, transform: [{ scale: buttonScale }] },
            ]}
          >
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Icon name="check" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClearText}>
              <Icon name="times" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 15,
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 10,
  },
  input: {
    marginTop: 20,
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontFamily: 'mono',
    lineHeight: 25,
    fontSize: 18,
    backgroundColor: '#f5fcfc',
    minHeight: 80, // Minimum height for the input
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  audioButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    flex: 0,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    marginHorizontal: 3,
  },
  cancelButton: {
    backgroundColor: '#e60000',
    borderRadius: 24,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: '#50C878',
    borderRadius: 24,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default UserInputModule;
