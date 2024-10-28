import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

interface AudioRecordingService {
  recording: Audio.Recording | null;
  isRecording: boolean;
  isTranscribing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  transcribeAudio: (uri: string) => Promise<string>;
}

class AudioRecordingServiceImpl implements AudioRecordingService {
  recording: Audio.Recording | null = null;
  isRecording: boolean = false;
  isTranscribing: boolean = false;

  constructor() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  }

  async startRecording(): Promise<void> {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        throw new Error('Permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Use WAV format for better compatibility
      const recordingOptions = {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          extension: '.wav',
          // eslint-disable-next-line import/namespace
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAV,
          // eslint-disable-next-line import/namespace
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          extension: '.wav',
          // eslint-disable-next-line import/namespace
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          // eslint-disable-next-line import/namespace
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const { recording } = await Audio.Recording.createAsync(
        recordingOptions,
        (status) => console.log('Recording status:', status),
        100
      );

      this.recording = recording;
      this.isRecording = true;
    } catch (err) {
      console.error('Failed to start recording', err);
      throw err;
    }
  }

  async stopRecording(): Promise<string | null> {
    if (!this.recording) {
      return null;
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isRecording = false;
      return uri;
    } catch (err) {
      console.error('Failed to stop recording', err);
      throw err;
    }
  }

  private async readFileAsBase64(uri: string): Promise<string> {
    try {
      const base64Data = await FileSystem.readAsStringAsync(
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );
      return base64Data;
    } catch (error) {
      console.error('Error reading file as base64:', error);
      throw error;
    }
  }

  async transcribeAudio(uri: string): Promise<string> {
    this.isTranscribing = true;
    try {
      // Read the file as base64
      const base64Audio = await this.readFileAsBase64(uri);

      // Create JSON payload with base64 audio data
      const payload = {
        inputs: base64Audio,
        model: 'openai/whisper-large-v3-turbo',
        parameters: {
          return_timestamps: false,
        },
      };

      const response = await fetch(
        'https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer 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',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Transcription API error:', errorText);
        throw new Error(`Transcription failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      return result.text || '';
    } catch (err) {
      console.error('Transcription error:', err);
      throw err;
    } finally {
      this.isTranscribing = false;
    }
  }
}

export const audioRecordingService = new AudioRecordingServiceImpl();
