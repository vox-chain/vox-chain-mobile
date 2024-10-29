import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import HeaderRight from './HeaderRight';

const CustomHeader: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.mainTitleContainer}>
        <Image style={styles.logo} source={require('../../assets/VoxChain_2.png')} />
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
  logo: {
    width: 135,
    height: 15,
  },
});

export default CustomHeader;
