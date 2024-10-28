import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import HeaderRight from './HeaderRight';

const CustomHeader: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.mainTitleContainer}>
        <MaterialIcons name="diversity-2" size={22} color="red" />
        <Text style={styles.mainTitle}>VoxChain</Text>
      </View>
      <View style={styles.headerRight}>
        <HeaderRight />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerRight: {},
  mainTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
    color: 'red',
  },
});

export default CustomHeader;
