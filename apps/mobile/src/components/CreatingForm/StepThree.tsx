import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SECURE_KEYS } from '~/src/lib/constants';
import { getValueFor } from '~/src/lib/secureStore';

const Header: React.FC = () => (
  <Text style={styles.title}>Write down your Secret Recovery Phrase</Text>
);

const Description: React.FC = () => (
  <Text className="text-foreground" style={styles.description}>
    This is your Secret Recovery Phrase. Write it down on a paper and keep it in a safe place.
    You'll be asked to re-enter this phrase (in order) on the next step.
  </Text>
);

interface PhraseRevealProps {
  seedPhrase: string | null;
}

const PhraseReveal: React.FC<PhraseRevealProps> = ({ seedPhrase }) => {
  const [isPhraseRevealed, setIsPhraseRevealed] = useState(false);

  const togglePhraseReveal = useCallback(() => {
    setIsPhraseRevealed((prev) => !prev);
  }, []);

  const renderPhraseWords = () => {
    if (!seedPhrase) return null;
    return seedPhrase.split(' ').map((word, index) => (
      <Text key={index} style={styles.phraseWord}>
        {word}
      </Text>
    ));
  };

  return (
    <View style={styles.revealBox}>
      <Text style={styles.revealText}>Tap to reveal your Secret Recovery Phrase</Text>
      <Text style={styles.warningText}>Make sure no one is watching your screen.</Text>

      {isPhraseRevealed ? (
        <View style={styles.phraseContainer}>
          {renderPhraseWords()}
          <TouchableOpacity style={styles.viewButton} onPress={togglePhraseReveal}>
            <Text style={styles.viewButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.viewButton} onPress={togglePhraseReveal}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface ContinueButtonProps {
  onPress: () => void;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.continueButton} onPress={onPress}>
    <Text style={styles.continueButtonText}>Continue</Text>
  </TouchableOpacity>
);

const LoadingIndicator: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#F20530" />
  </View>
);

const StepThree: React.FC = () => {
  const navigation = useNavigation();
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeedPhrase = async () => {
      try {
        const phrase = await getValueFor(SECURE_KEYS.PHRASE_KEY);
        setSeedPhrase(phrase);
      } catch (error) {
        console.error('Error getting seed phrase:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeedPhrase();
  }, []);

  const handleContinue = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'Home' } }],
    });
  }, [navigation]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <Description />
      <PhraseReveal seedPhrase={seedPhrase} />
      <ContinueButton onPress={handleContinue} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  revealBox: {
    backgroundColor: '#F2F4F6',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  revealText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  viewButton: {
    borderWidth: 1,
    borderColor: '#F20530',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  viewButtonText: {
    color: '#F20530',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#F20530',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  phraseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  phraseWord: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
    width: '30%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StepThree;
