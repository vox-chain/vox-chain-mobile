import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/reusables/select';
import { useNetworkContext } from '@/context/NetworkContext';
import { NETWORKS } from '@/lib/network';

interface Option {
  value: string;
  label: string;
}

const NetworkSelector: React.FC = () => {
  const { network, updateNetwork } = useNetworkContext();

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const handleValueChange = (option?: Option) => {
    if (!option) return;
    const selectedChainId = option.value; // Extract the chainId from the option
    const selectedNetwork = NETWORKS.find((net) => net.chainId.toString() === selectedChainId);
    if (selectedNetwork) {
      updateNetwork(selectedNetwork.chainId); // Pass chainId to updateNetwork
    }
  };

  return (
    <Select
      value={{
        label: network?.name || NETWORKS[0].name,
        value: `${network?.chainId || NETWORKS[0].chainId}`, // Use chainId for value
      }}
      className="self-center"
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[280px] rounded-full">
        <SelectValue className="text-foreground text-md" placeholder="Select a network" />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className="w-[280px] rounded-xl mt-1">
        <ScrollView className="max-h-[500px] flex-1">
          <SelectGroup>
            <SelectLabel>Networks :</SelectLabel>
            {NETWORKS.map((network, index) => (
              <React.Fragment key={index}>
                <SelectItem
                  label={network.name}
                  value={`${network.chainId}`} // Use chainId as the value
                  Icon={network.icon}
                />
                {index !== NETWORKS.length - 1 && <SelectSeparator />}
              </React.Fragment>
            ))}
          </SelectGroup>
        </ScrollView>
      </SelectContent>
    </Select>
  );
};

export default NetworkSelector;
