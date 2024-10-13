import { createContext, useContext, useEffect, useState } from 'react';

import { loadLiveNetwork, Network, NETWORKS, saveLiveNetwork } from '../lib/network';

interface NetworkContextType {
  network: Network | null;
  updateNetwork: (chainId: number) => void;
  //updateNetwork: (networkSymbol: NetworkSymbol) => void;
}
const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: React.ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [network, setNetwork] = useState<Network | null>(null);

  useEffect(() => {
    (async () => {
      const savedChainId = await loadLiveNetwork();
      const initialNetwork = NETWORKS.find((net) => net.chainId === savedChainId) || NETWORKS[0];
      setNetwork(initialNetwork);
    })();
  }, []);

  function updateNetwork(chainId: number) {
    const new_network = NETWORKS.find((net) => net.chainId === chainId);
    if (!new_network) throw new Error(`Network with chainId "${chainId}" not found`);
    if (chainId === network?.chainId) return;
    saveLiveNetwork(chainId);
    setNetwork(new_network);
  }

  return (
    <NetworkContext.Provider value={{ network, updateNetwork }}>{children}</NetworkContext.Provider>
  );
};

export const useNetworkContext = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetworkContext must be used within a NetworkProvider');
  return context;
};
