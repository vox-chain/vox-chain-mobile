import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { type TabParamList } from './types';
import BottomBar from '../components/BottomBar';
import NFTsection from '../components/Home/NFTsection';
import HomeScreen from '../screens/HomeScreen';
import ParingScreen from '../screens/ParingScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import TransactionHistory from '../screens/TransactionHistory';
import TransferScreen from '../screens/TransferScreen';

import HeaderRight from '~/src/components/HeaderRight';

const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomBar {...props} />}
      screenOptions={{
        headerRight: () => <HeaderRight />,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'FT Wallet',
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          title: 'Portfolio',
        }}
      />
      <Tab.Screen name="Pairings" component={ParingScreen} />
      <Tab.Screen name="TransferScreen" component={TransferScreen} />
      <Tab.Screen name="TransactionHistory" component={TransactionHistory} />
      <Tab.Screen name="NFTsection" component={NFTsection} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
