import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { type TabParamList } from './types';
import BottomBar from '../components/BottomBar';
import CustomHeader from '../components/CustomHeader'; // Import the custom header
import NFTsection from '../components/Home/NFTsection';
import ContactScreen from '../screens/ContactScreen';
import HomeScreen from '../screens/HomeScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TransactionHistory from '../screens/TransactionHistory';
import TransferScreen from '../screens/TransferScreen';
import LogsScreen from '../screens/LogsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomBar {...props} />}
      screenOptions={{
        header: () => <CustomHeader />, // Use the CustomHeader without subtitle
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }} // Individual screen titles remain for tabs
      />
      <Tab.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact' }} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} options={{ title: 'Portfolio' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Tab.Screen name="Logs" component={LogsScreen} />
      <Tab.Screen name="History" component={TransactionHistory} options={{ title: 'History' }} />
      <Tab.Screen name="NFTsection" component={NFTsection} options={{ title: 'NFTs' }} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
