import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ParingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ParingScreen</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
export default ParingScreen;
