import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { GET_STARTED_DATA } from '@/lib/constants';

type GetStartedItemProps = {
  item: (typeof GET_STARTED_DATA)[number];
};

const GetStartedItem = ({ item }: GetStartedItemProps) => {
  const { width } = useWindowDimensions();
  const { isDarkMode } = useTheme(); // Use the theme
  const { t } = useTranslation(); // Use the translation

  return (
    <View
      style={[
        styles.container,
        { width },
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <Image source={item.image} style={[styles.image, { width, resizeMode: 'contain' }]} />
      <View style={{ flex: 0.3 }}>
        <Text style={[styles.title, isDarkMode ? styles.darkTitle : styles.lightTitle]}>
          {t(item.title)}
        </Text>
        <Text style={[styles.desc, isDarkMode ? styles.darkDesc : styles.lightDesc]}>
          {t(item.desc)}
        </Text>
      </View>
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
  image: {
    flex: 0.7,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
  },
  lightTitle: {
    color: '#F20530',
  },
  darkTitle: {
    color: '#F20530',
  },
  desc: {
    fontWeight: '300',
    textAlign: 'center',
    paddingHorizontal: 70,
  },
  lightDesc: {
    color: '#011826',
  },
  darkDesc: {
    color: '#B0B0B0',
  },
});

export default GetStartedItem;
