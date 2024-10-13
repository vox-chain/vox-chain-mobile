/**
 * @desc Refference list of eip155 chains
 * @url https://chainlist.org
 */

import { Binance, Ethereum } from '@/lib/icons';

export type NetworkConfig = {
  order: number;
  networkId: number;
  productionNetwork: boolean;
  chainId: string;
  chainName: string;
  graph?: string;
  name: string;
  productionNetworkId?: number;
  id: string;
  icon: any;
  testnet: boolean;
  testnetId?: number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string;
  faucet?: string;
  networkNameValidator: string;
};

export const EIP155_CHAINS: Record<string, NetworkConfig> = {
  '1': {
    order: 1,
    networkId: 1,
    productionNetwork: true,
    chainId: `0x${Number(1).toString(16)}`,
    chainName: 'Ethereum Mainnet',
    name: 'Ethereum',
    id: 'ethereum',
    icon: Ethereum,
    testnet: false,
    testnetId: 11155111,
    // testnetId: 1337,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/eth'],
    blockExplorerUrls: 'https://etherscan.io/',
    networkNameValidator: 'eth',
  },
  '11155111': {
    order: 1,
    networkId: 11155111,
    productionNetwork: false,
    chainId: `0x${Number(11155111).toString(16)}`,
    chainName: 'Sepolia (ETH Testnet)',
    testnet: true,
    graph: 'sepolia',
    icon: Ethereum,
    productionNetworkId: 1,
    name: 'sepolia',
    id: 'sepolia',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/eth_sepolia'],
    blockExplorerUrls: 'https://sepolia.etherscan.io',
    faucet: 'https://sepoliafaucet.com/',
    networkNameValidator: 'eth',
  },

  '97': {
    order: 3,
    networkId: 97,
    productionNetwork: false,
    chainId: `0x${Number(97).toString(16)}`,
    chainName: 'Binance Testnet',
    testnet: true,
    icon: Binance,
    name: 'Binance',
    id: 'binanceTestnet',
    productionNetworkId: 56,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/bsc_testnet_chapel'],
    blockExplorerUrls: 'https://testnet.bscscan.com',
    faucet: 'https://testnet.binance.org/faucet-smart',
    networkNameValidator: 'eth',
  },
  '56': {
    order: 3,
    networkId: 56,
    productionNetwork: true,
    chainId: `0x${Number(56).toString(16)}`,
    chainName: 'Binance Smart Chain',
    testnet: false,
    icon: Binance,
    testnetId: 97,
    id: 'binance',
    name: 'Binance',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/bsc'],
    blockExplorerUrls: 'https://bscscan.com',
    networkNameValidator: 'eth',
  },
};

export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
};

export function getEip155Testnets() {
  const testnets: Record<string, NetworkConfig> = {};
  Object.keys(EIP155_CHAINS).forEach((key) => {
    const chain: NetworkConfig = EIP155_CHAINS[key];
    if (chain.testnet) testnets[key] = chain;
  });
  return testnets;
}

const EIP155Utils = {
  getTestChains: () => getEip155Testnets(),
  //   getChains: () => EIP155_CHAINS,
  // For dev purpose
  getChains: () => EIP155Utils.getTestChains(),
  getChain: (chainId: string) => EIP155_CHAINS[chainId],
  getSignMethods: () => EIP155_SIGNING_METHODS,
};

export default EIP155Utils;
