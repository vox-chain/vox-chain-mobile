import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => (
  <View style={styles.progressBar}>
    <View style={[styles.progressStep, styles.activeStep]} />
    <View style={[styles.progressStep, currentStep >= 2 ? styles.activeStep : null]} />
    <View style={[styles.progressStep, currentStep === 3 ? styles.activeStep : null]} />
  </View>
);

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  progressStep: {
    width: 60,
    height: 4,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 4,
  },
  activeStep: {
    backgroundColor: '#F20530',
  },
});

export default ProgressBar;
