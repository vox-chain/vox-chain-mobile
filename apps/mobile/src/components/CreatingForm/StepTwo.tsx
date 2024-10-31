import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface StepTwoProps {
  onNext: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ onNext }) => (
  <ScrollView style={styles.stepContainer}>
    <Text className="text-foreground" style={styles.title}>
      Secure your wallet
    </Text>
    <Text className="text-foreground" style={styles.warningText}>
      Don't risk losing your funds. Protect your wallet by saving your Secret Recovery Phrase in a
      place you trust. It's the only way to recover your wallet if you get locked out of the app or
      get a new device.
    </Text>
    <Image source={require('../../../assets/dots.png')} style={styles.image} />
    <TouchableOpacity style={styles.startButton} onPress={onNext}>
      <Text style={styles.startButtonText}>Next</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.remindLaterButton}>
      <Text style={styles.remindLaterText}>Remind me later</Text>
    </TouchableOpacity>
    <Text style={styles.recommendedText}>(Not recommended)</Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  stepContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  image: {
    width: '80%',
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  warningText: {
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#F20530',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 40,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  remindLaterButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  remindLaterText: {
    color: '#F20530',
    fontSize: 14,
  },
  recommendedText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
});

export default StepTwo;
