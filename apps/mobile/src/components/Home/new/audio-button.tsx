import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Audio } from 'expo-av';

interface AudioButtonProps {
  isListening: boolean;
  isTranscribing: boolean;
  onPress: () => void;
}

const AudioButton: React.FC<AudioButtonProps> = ({ isListening, isTranscribing, onPress }) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const barAnim1 = useRef(new Animated.Value(1)).current;
  const barAnim2 = useRef(new Animated.Value(1)).current;
  const barAnim3 = useRef(new Animated.Value(1)).current;
  const barAnim4 = useRef(new Animated.Value(1)).current;
  const barAnim5 = useRef(new Animated.Value(1)).current;

  const [hasPermission, setHasPermission] = useState(false);

  const requestMicrophonePermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status === 'granted') {
      setHasPermission(true);
    } else {
      Alert.alert('Permission Denied', 'Microphone access is required to record audio.');
    }
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isListening) {
      const startWaveAnimation = () => {
        const waveSequence = (barAnim: Animated.Value, delay: number) => {
          return Animated.sequence([
            Animated.timing(barAnim, {
              toValue: 2,
              duration: 300,
              useNativeDriver: true,
              delay,
            }),
            Animated.timing(barAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]);
        };

        Animated.loop(
          Animated.stagger(100, [
            waveSequence(barAnim1, 0),
            waveSequence(barAnim2, 100),
            waveSequence(barAnim3, 200),
            waveSequence(barAnim4, 300),
            waveSequence(barAnim5, 400),
          ])
        ).start();
      };

      startWaveAnimation();
    } else {
      // Reset animations
      barAnim1.setValue(1);
      barAnim2.setValue(1);
      barAnim3.setValue(1);
      barAnim4.setValue(1);
      barAnim5.setValue(1);
    }

    // Cleanup animations on unmount
    return () => {
      barAnim1.stopAnimation();
      barAnim2.stopAnimation();
      barAnim3.stopAnimation();
      barAnim4.stopAnimation();
      barAnim5.stopAnimation();
    };
  }, [isListening]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (!hasPermission) {
            console.log('Requesting permission');
            requestMicrophonePermission();
          } else {
            console.log('Pressing button');
            onPress();
          }
        }}
        disabled={isTranscribing}
        style={styles.buttonWrapper}
      >
        <View
          style={[
            styles.button,
            isTranscribing && styles.transcribing,
            isListening && styles.recording,
          ]}
        >
          {isTranscribing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {!isListening && <Icon name="microphone" size={24} color="#fff" />}
              {isListening && (
                <View style={styles.barsContainer}>
                  <Animated.View style={[styles.bar, { transform: [{ scaleY: barAnim1 }] }]} />
                  <Animated.View style={[styles.bar, { transform: [{ scaleY: barAnim2 }] }]} />
                  <Animated.View style={[styles.bar, { transform: [{ scaleY: barAnim3 }] }]} />
                  <Animated.View style={[styles.bar, { transform: [{ scaleY: barAnim4 }] }]} />
                  <Animated.View style={[styles.bar, { transform: [{ scaleY: barAnim5 }] }]} />
                </View>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
      {isListening && (
        <View style={styles.timerContainer}>
          <Icon name="clock-outline" size={16} color="#6C757D" />
          <Text style={styles.timer}>{formatTime(recordingTime)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', // Changed to column to stack vertically
    alignItems: 'center',
    gap: 12,
  },
  buttonWrapper: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 24,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  transcribing: {
    backgroundColor: '#6C757D',
  },
  recording: {
    backgroundColor: '#000',
  },
  barsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 17,
    alignItems: 'flex-end',
  },
  bar: {
    width: 3,
    height: 10,
    backgroundColor: '#fff',
    marginHorizontal: 1,
    borderRadius: 2,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    gap: 4,
    marginTop: 0, // Added margin for spacing between button and timer
  },
  timer: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AudioButton;
