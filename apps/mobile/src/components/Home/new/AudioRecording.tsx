import React from 'react';
import { View, StyleSheet } from 'react-native';

import AudioButton from './audio-button';

import { useAudioRecording } from '@/hooks/useAudioRecording';

interface AudioRecorderComponentProps {
  onTranscriptionComplete: (text: string) => void;
}

const AudioRecorderComponent: React.FC<AudioRecorderComponentProps> = ({
  onTranscriptionComplete,
}) => {
  const { isListening, isTranscribing, startRecording, stopRecording } =
    useAudioRecording(onTranscriptionComplete);

  const handlePress = async () => {
    if (isListening) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <AudioButton
        isListening={isListening}
        isTranscribing={isTranscribing}
        onPress={handlePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AudioRecorderComponent;
