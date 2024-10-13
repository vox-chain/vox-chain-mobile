import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from './constants';
import { Binance, Ethereum, Linea, Polygon } from './icons';

const STORAGE_KEY = STORAGE_KEYS.LIVE_NETWORK;

interface Network {
  name: string;
  symbol: string;
  url_rpc: string;
  apiUrl: string; // this API for transactions history  on rach network
  chainId: number;
  icon: React.ComponentType<any>;
}

const NETWORKS: Network[] = [
  {
    name: 'Sepolia',
    symbol: 'Sep',
    url_rpc: 'https://sepolia.drpc.org',
    apiUrl: 'https://api-sepolia.etherscan.io/api',
    chainId: 11155111,
    icon: Ethereum,
  },
  {
    name: 'Binance Smart Chain Testnet',
    symbol: 'BNB',
    url_rpc: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    apiUrl: 'https://api-testnet.bscscan.com/api',
    chainId: 97,
    icon: Binance,
  },
  {
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    url_rpc: 'https://mainnet.infura.io/v3/a90c256f6d1240b3b2b1cdfc5ce5acf9',
    apiUrl: 'https://api.etherscan.io/api',
    chainId: 1,
    icon: Ethereum,
  },
  {
    name: 'Binance Smart Chain Mainnet',
    symbol: 'BSC',
    url_rpc: 'https://bsc-dataseed.binance.org/',
    apiUrl: 'https://api.bscscan.com/api',
    chainId: 56,
    icon: Binance,
  },
  {
    name: 'Linea Mainnet',
    symbol: 'ETH',
    url_rpc: 'https://rpc.linea.build',
    apiUrl: 'https://api.lineascan.build/api',
    chainId: 59144,
    icon: Linea,
  },
  {
    name: 'Polygon Mainnet', // Updated with Infura URL
    symbol: 'MATIC',
    url_rpc: 'https://polygon-rpc.com', // Replace with your Infura project ID
    apiUrl: 'https://api.polygonscan.com/api',
    chainId: 137,
    icon: Polygon, // Replace with the correct icon for Polygon
  },
] as const;

const NETWORKS_DICT = {
  Sep: {
    name: 'Sepolia',
    symbol: 'Sep',
    url_rpc: 'https://sepolia.drpc.org',
    apiUrl: 'https://api-sepolia.etherscan.io/api',
    chainId: 11155111,
    icon: Ethereum,
  },
  BNB: {
    name: 'Binance Smart Chain Testnet',
    symbol: 'BNB',
    url_rpc: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    apiUrl: 'https://api-testnet.bscscan.com/api',
    chainId: 97,
    icon: Binance,
  },
  ETH: {
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    url_rpc: 'https://mainnet.infura.io/v3/a90c256f6d1240b3b2b1cdfc5ce5acf9',
    apiUrl: 'https://api.etherscan.io/api',
    chainId: 1,
    icon: Ethereum,
  },
  BSC: {
    name: 'Binance Smart Chain Mainnet',
    symbol: 'BSC',
    url_rpc: 'https://bsc-dataseed.binance.org/',
    apiUrl: 'https://api.bscscan.com/api',
    chainId: 56,
    icon: Binance,
  },
  LINEA: {
    name: 'Linea Mainnet',
    symbol: 'ETH',
    url_rpc: 'https://rpc.linea.build',
    apiUrl: 'https://api.lineascan.build/api',
    chainId: 59144,
    icon: Linea,
  },
  MATIC: {
    name: 'Polygon Mainnet',
    symbol: 'MATIC',
    url_rpc: 'https://polygon-rpc.com',
    apiUrl: 'https://api.polygonscan.com/api',
    chainId: 137,
    icon: Polygon,
  },
} as const;

export type NetworkSymbol = keyof typeof NETWORKS_DICT;

const getNetworkRPCURL = (networkName: string): string => {
  const network = NETWORKS.find((n) => n.name === networkName);
  if (!network) {
    throw new Error(`Network "${networkName}" not found`);
  }
  return network.url_rpc;
};

const saveLiveNetwork = async (chainId: number) => {
  // console.log('saved live chainId to storage', chainId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chainId));
};

const loadLiveNetwork = async (): Promise<number | null> => {
  const chainId = await AsyncStorage.getItem(STORAGE_KEY);
  //console.log('live chainId from storage', chainId);
  return chainId ? JSON.parse(chainId) : null;
};

export { getNetworkRPCURL, loadLiveNetwork, Network, NETWORKS, NETWORKS_DICT, saveLiveNetwork };

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { STORAGE_KEYS } from './constants';

// import { Binance, Ethereum, Linea, Polygon } from './icons';

// const STORAGE_KEY = STORAGE_KEYS.LIVE_NETWORK;

// interface Network {
//   name: string;
//   symbol: string;
//   url_rpc: string;
//   apiUrl: string; // this API for transactions history  on rach network
//   chainId: number;
//   icon: React.ComponentType<any>;
// }

// const NETWORKS: Network[] = [
//   {
//     name: 'Sepolia',
//     symbol: 'Sep',
//     url_rpc: 'https://sepolia.drpc.org',
//     apiUrl: 'https://api-sepolia.etherscan.io/api',
//     chainId: 11155111,
//     icon: Ethereum,
//   },
//   {
//     name: 'Binance Smart Chain Testnet',
//     symbol: 'BNB',
//     url_rpc: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
//     apiUrl: 'https://api-testnet.bscscan.com/api',
//     chainId: 97,
//     icon: Binance,
//   },
//   {
//     name: 'Ethereum Mainnet',
//     symbol: 'ETH',
//     url_rpc: 'https://mainnet.infura.io/v3/a90c256f6d1240b3b2b1cdfc5ce5acf9',
//     apiUrl: 'https://api.etherscan.io/api',
//     chainId: 1,
//     icon: Ethereum,
//   },
//   {
//     name: 'Binance Smart Chain Mainnet',
//     symbol: 'BSC',
//     url_rpc: 'https://bsc-dataseed.binance.org/',
//     apiUrl: 'https://api.bscscan.com/api',
//     chainId: 56,
//     icon: Binance,
//   },
//   {
//     name: 'Linea Mainnet',
//     symbol: 'ETH',
//     url_rpc: 'https://rpc.linea.build',
//     apiUrl: 'https://api.lineascan.build/api',
//     chainId: 59144,
//     icon: Linea,
//   },
//   {
//     name: 'Polygon Mainnet', // Updated with Infura URL
//     symbol: 'MATIC',
//     url_rpc: 'https://polygon-rpc.com', // Replace with your Infura project ID
//     apiUrl: 'https://api.polygonscan.com/api',
//     chainId: 137,
//     icon: Polygon, // Replace with the correct icon for Polygon
//   },
// ] as const;

// const NETWORKS_DICT = {
//   Sep: {
//     name: 'Sepolia',
//     symbol: 'Sep',
//     url_rpc: 'https://sepolia.drpc.org',
//     apiUrl: 'https://api-sepolia.etherscan.io/api',
//     chainId: 11155111,
//     icon: Ethereum,
//   },
//   BNB: {
//     name: 'Binance Smart Chain Testnet',
//     symbol: 'BNB',
//     url_rpc: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
//     apiUrl: 'https://api-testnet.bscscan.com/api',
//     chainId: 97,
//     icon: Binance,
//   },
//   ETH: {
//     name: 'Ethereum Mainnet',
//     symbol: 'ETH',
//     url_rpc: 'https://mainnet.infura.io/v3/a90c256f6d1240b3b2b1cdfc5ce5acf9',
//     apiUrl: 'https://api.etherscan.io/api',
//     chainId: 1,
//     icon: Ethereum,
//   },
//   BSC: {
//     name: 'Binance Smart Chain Mainnet',
//     symbol: 'BSC',
//     url_rpc: 'https://bsc-dataseed.binance.org/',
//     apiUrl: 'https://api.bscscan.com/api',
//     chainId: 56,
//     icon: Binance,
//   },
//   LINEA: {
//     name: 'Linea Mainnet',
//     symbol: 'ETH',
//     url_rpc: 'https://rpc.linea.build',
//     apiUrl: 'https://api.lineascan.build/api',
//     chainId: 59144,
//     icon: Linea,
//   },
//   MATIC: {
//     name: 'Polygon Mainnet',
//     symbol: 'MATIC',
//     url_rpc: 'https://polygon-rpc.com',
//     apiUrl: 'https://api.polygonscan.com/api',
//     chainId: 59144,
//     icon: Polygon,
//   },
// } as const;

// export type NetworkSymbol = keyof typeof NETWORKS_DICT;

// const getNetworkRPCURL = (networkName: string): string => {
//   const network = NETWORKS.find(n => n.name === networkName);
//   if (!network) {
//     throw new Error(`Network "${networkName}" not found`);
//   }
//   return network.url_rpc;
// };

// const saveLiveNetwork = async (network: NetworkSymbol) => {
//   await AsyncStorage.setItem(STORAGE_KEY, network);
// };

// const loadLiveNetwork = async (): Promise<NetworkSymbol | null> => {
//   return (await AsyncStorage.getItem(STORAGE_KEY)) as NetworkSymbol;
// };

// export {
//   getNetworkRPCURL,
//   loadLiveNetwork,
//   Network,
//   NETWORKS,
//   NETWORKS_DICT,
//   saveLiveNetwork,
// };
