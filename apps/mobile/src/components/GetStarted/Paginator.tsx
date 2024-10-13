import React from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';

import { GET_STARTED_DATA } from '@/lib/constants';

const Paginator = ({ scrollx }: { scrollx: Animated.Value }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container]}>
      {GET_STARTED_DATA.map((item, i) => {
        const input = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollx.interpolate({
          inputRange: input,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });
        return <Animated.View style={[styles.dot, { width: dotWidth }]} key={i.toString()} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F20530',
    margin: 5,
  },
});

export default Paginator;
