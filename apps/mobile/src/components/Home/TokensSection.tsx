import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import type { TabParamList } from '../../navigation/types'; // Import your TabParamList

const TokensSection: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  // Initialize navigation
  const navigation = useNavigation<NativeStackNavigationProp<TabParamList>>();

  return (
    <View style={styles.tokenSection}>
      <View style={styles.titleRow}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>
          {t('Tokens')}
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
          <Text
            style={[
              styles.historyText,
              isDarkMode ? styles.darkHistoryText : styles.lightHistoryText,
            ]}
          >
            {t('History')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('NFTsection')}>
          <Text
            style={[
              styles.historyText,
              isDarkMode ? styles.darkHistoryText : styles.lightHistoryText,
            ]}
          >
            {t('NFTs')}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Text
          style={[styles.importText, isDarkMode ? styles.darkImportText : styles.lightImportText]}
        >
          {t('Import a token')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tokenSection: {
    marginTop: 30,
  },
  titleRow: {
    flexDirection: 'row', // Aligns Tokens and History in a row
    justifyContent: 'space-between', // Distributes space evenly
    alignItems: 'center', // Align items vertically center
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  importText: {
    marginTop: 10,
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  darkImportText: {
    color: '#4dabf5',
  },
  lightImportText: {
    color: 'blue',
  },
  darkHistoryText: {
    color: '#4dabf5', // Adjust color to your theme
  },
  lightHistoryText: {
    color: 'blue', // Adjust color to your theme
  },
});

export default TokensSection;

// import { useTheme } from '../../context/ThemeContext';
// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const TokensSection: React.FC = () => {
//   const { isDarkMode } = useTheme();
//   const { t } = useTranslation();

//   return (
//     <View style={styles.tokenSection}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           isDarkMode ? styles.darkText : styles.lightText,
//         ]}
//       >
//         {t('Tokens')}
//       </Text>
//       <TouchableOpacity>
//         <Text
//           style={[
//             styles.importText,
//             isDarkMode ? styles.darkImportText : styles.lightImportText,
//           ]}
//         >
//           {t('Import a token')}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   tokenSection: {
//     marginTop: 30,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   importText: {
//     marginTop: 10,
//   },
//   darkText: {
//     color: 'white',
//   },
//   lightText: {
//     color: 'black',
//   },
//   darkImportText: {
//     color: '#4dabf5',
//   },
//   lightImportText: {
//     color: 'blue',
//   },
// });

// export default TokensSection;
