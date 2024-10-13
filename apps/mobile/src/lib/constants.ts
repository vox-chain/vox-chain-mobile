import { Theme } from '@react-navigation/native';

export const NAV_THEME = {
  LIGHT: {
    dark: false,
    colors: {
      background: 'hsl(0 0% 100%)', // background
      border: 'hsl(240 5.9% 90%)', // border
      card: 'hsl(0 0% 100%)', // card
      notification: 'hsl(0 84.2% 60.2%)', // destructive
      primary: 'hsl(240 5.9% 10%)', // primary
      text: 'hsl(240 10% 3.9%)', // foreground
    },
  } as Theme,
  DARK: {
    dark: true,
    colors: {
      background: 'hsl(240 10% 3.9%)', // background
      border: 'hsl(240 3.7% 15.9%)', // border
      card: 'hsl(240 10% 3.9%)', // card
      notification: 'hsl(0 72% 51%)', // destructive
      primary: 'hsl(0 0% 98%)', // primary
      text: 'hsl(0 0% 98%)', // foreground
    },
  } as Theme,
};

export const STORAGE_KEYS = {
  HAS_PRIVATE_KEY: 'hasPrivateKey',
  THEME: 'theme',
  USER_TOKEN: 'userToken',
  LOCAL: 'local',
  LIVE_NETWORK: 'live_network',
  ADDRESS: 'wallet-address',
} as const;

export const SECURE_KEYS = {
  PK: 'privateKey',
  PHRASE_KEY: 'phraseKey',
} as const;

export const API_KEYS = {
  AlchemyApiKey: 'J8xjc0Pmc4Lc7r0WI3dFiEbrwzqe0Gai',
} as const;

export const GET_STARTED_DATA = [
  {
    id: '1',
    title: 'Welcome to FeverTokens',
    desc: 'lorem lorem lorem lorem lorem lorem lorem lorem',
    image: require('~/assets/getStarted/started 1.png'),
  },
  {
    id: '2',
    title: 'Manage your digital assets',
    desc: 'lorem lorem lorem lorem lorem lorem lorem lorem',
    image: require('~/assets/getStarted/started 2.png'),
  },
  {
    id: '3',
    title: 'Your gateway to web3',
    desc: 'lorem lorem lorem lorem lorem lorem lorem lorem',
    image: require('~/assets/getStarted/started 3.png'),
  },
];
