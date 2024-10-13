import React, { useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, View, ViewToken } from 'react-native';

import GetStartedButton from '../components/GetStarted/GetStartedButton';
import GetStartedItem from '../components/GetStarted/GetStartedItem';
import Paginator from '../components/GetStarted/Paginator';
import { type RootStackScreenProps } from '../navigation/types';

import { useTheme } from '@/context/ThemeContext';
import { GET_STARTED_DATA } from '@/lib/constants';

const GetStartedPage = ({ navigation }: RootStackScreenProps<'GetStarted'>) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [, setCurrentIndex] = useState(0);
  const { isDarkMode } = useTheme();

  const viewItemChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<(typeof GET_STARTED_DATA)[number]>[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const viewConf = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const flatListRef = useRef(null);

  const handleGetStarted = () => {
    navigation.navigate('WalletSetup');
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={GET_STARTED_DATA}
          renderItem={({ item }) => <GetStartedItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewItemChanged}
          viewabilityConfig={viewConf}
          ref={flatListRef}
        />
      </View>
      <Paginator scrollx={scrollX} />
      <GetStartedButton handleGetStarted={handleGetStarted} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
});

export default GetStartedPage;
