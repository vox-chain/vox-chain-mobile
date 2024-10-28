import { useState, useCallback } from 'react';
import { audioRecordingService } from '@/services/Transcription/AudioRecording';
import { Alert } from 'react-native';

export const useAudioRecording = (onTranscriptionComplete: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const startRecording = useCallback(async () => {
    try {
      await audioRecordingService.startRecording();
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording. Please check permissions.');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      const uri = await audioRecordingService.stopRecording();
      setIsListening(false);

      if (uri) {
        setIsTranscribing(true);
        try {
          const transcription = await audioRecordingService.transcribeAudio(uri);
          if (transcription) {
            onTranscriptionComplete(transcription);
          } else {
            Alert.alert('Error', 'No transcription received');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          Alert.alert('Error', 'Failed to transcribe audio. Please try again.');
        }
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  }, [onTranscriptionComplete]);

  return {
    isListening,
    isTranscribing,
    startRecording,
    stopRecording,
  };
};
