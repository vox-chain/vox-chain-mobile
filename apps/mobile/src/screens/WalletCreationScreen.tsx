import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';

import ProgressBar from '@/components/CreatingForm/ProgressBar';
import StepThree from '@/components/CreatingForm/StepThree';
import StepTwo from '@/components/CreatingForm/StepTwo';
import { RootStackScreenProps } from '@/navigation/types';

const WalletCreationScreen = ({ navigation }: RootStackScreenProps<'WalletCreationForm'>) => {
  const [step, setStep] = useState(2);

  const renderStep = () => {
    switch (step) {
      //   case 1:
      //     return <StepOne onNext={() => setStep(2)} />;
      case 2:
        return <StepTwo onNext={() => setStep(3)} />;
      case 3:
        return <StepThree />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container2}>
        <Image style={styles.logo} source={require('../../assets/Logo 2.png')} />
        <ProgressBar currentStep={step} />
        {renderStep()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    margin: 20,
  },
  logo: {
    width: 260,
    height: 35,
    margin: 'auto',
  },
});

export default WalletCreationScreen;
