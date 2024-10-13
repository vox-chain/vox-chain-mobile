import { FontAwesome5 } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNetworkContext } from '../context/NetworkContext';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../hooks/useToast';

const WalletInfo = () => {
  const { address } = useWallet();
  return (
    <View className="flex-row items-center bg-gray-100 rounded-2xl p-4 mb-6">
      <FontAwesome5 name="wallet" size={28} color="#F20530" />
      <Text className="ml-3 text-xl text-black">
        {address?.slice(0, 6)}....{address?.slice(-4)}
      </Text>
    </View>
  );
};

const AmountInput = ({
  amount,
  setAmount,
}: {
  amount: string;
  setAmount: (value: string) => void;
}) => (
  <View className="mb-6">
    <Text className="text-2xl font-bold mb-3 text-foreground">Amount</Text>
    <View className="flex-row items-center bg-gray-100 rounded-2xl p-4">
      <FontAwesome5 name="coins" size={28} color="#F20530" />
      <TextInput
        className="flex-1 ml-3 text-xl text-black placeholder-gray-950"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="0.00"
      />
      <TouchableOpacity className="bg-red-600 rounded-xl px-4 py-2">
        <Text className="text-white font-semibold">MAX</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// const CoinSelector = ({
//   selectedCoin,
//   setSelectedCoin,
// }: {
//   selectedCoin: 'BTC' | 'ETH' | 'USDT';
//   setSelectedCoin: (coin: 'BTC' | 'ETH' | 'USDT') => void;
// }) => {
//   const getCoinIcon = (coin: 'BTC' | 'ETH' | 'USDT') => {
//     switch (coin) {
//       case 'BTC':
//         return 'bitcoin';
//       case 'ETH':
//         return 'ethereum';
//       case 'USDT':
//         return 'usd';
//       default:
//         return 'coins';
//     }
//   };

//   return (
//     <View className="mb-6">
//       <Text className="text-2xl font-bold mb-3 text-foreground">Select Coin</Text>
//       <View className="flex-row justify-around">
//         {['BTC', 'ETH', 'USDT'].map((coin) => (
//           <TouchableOpacity
//             key={coin}
//             onPress={() => setSelectedCoin(coin as 'BTC' | 'ETH' | 'USDT')}
//             className={`items-center justify-center w-24 h-24 rounded-2xl ${
//               selectedCoin === coin ? 'bg-red-600' : 'bg-gray-200'
//             }`}
//           >
//             <FontAwesome6
//               name={getCoinIcon(coin as 'BTC' | 'ETH' | 'USDT')}
//               size={32}
//               color={selectedCoin === coin ? 'white' : 'black'}
//             />
//             <Text
//               className={`mt-2 font-semibold ${
//                 selectedCoin === coin ? 'text-white' : 'text-black'
//               }`}
//             >
//               {coin}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

const RecipientInput = ({
  recipientAddress,
  setRecipientAddress,
}: {
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
}) => (
  <View className="mb-6">
    <Text className="text-2xl font-bold mb-3 text-foreground">Recipient</Text>
    <View className="flex-row items-center bg-gray-100 rounded-2xl p-4">
      <FontAwesome5 name="user" size={28} color="#F20530" />
      <TextInput
        className="flex-1 ml-3 text-xl text-black placeholder-gray-950"
        value={recipientAddress}
        onChangeText={setRecipientAddress}
        placeholder="Enter address"
      />
    </View>
  </View>
);

const SendButton = ({ onPress, isPending }: { onPress: () => void; isPending: boolean }) => (
  <TouchableOpacity
    className={`bg-red-600 mt-3 rounded-2xl p-4 ${isPending ? 'opacity-50' : ''}`}
    onPress={onPress}
    disabled={isPending}
  >
    {isPending ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text className="text-white font-bold text-xl text-center">Send Coins</Text>
    )}
  </TouchableOpacity>
);

const TransferScreen: React.FC = () => {
  const { transfer } = useWallet();
  const { network } = useNetworkContext();
  const toast = useToast();

  const [amount, setAmount] = useState('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [recipientAddress, setRecipientAddress] = useState<string>('');

  const handleSendTransaction = useCallback(async () => {
    setIsPending(true);
    if (!network) {
      toast.error('Network or Wallet not initialized');
      return;
    }

    if (!recipientAddress || !amount) {
      toast.error('Please enter both recipient address and amount');
      return;
    }
    await transfer(recipientAddress, amount, network.url_rpc)
      .then(() => {
        //toast.success('Transaction is done successfully');
      })
      .catch(() => {
        toast.error('Error, transaction failed!');
      })
      .finally(() => {
        setIsPending(false);
      });
  }, [network, recipientAddress, amount]);

  return (
    <ImageBackground
      source={require('../../assets/SecondBackground.png')}
      className="flex-1 w-full h-full"
    >
      <ScrollView>
        <View className="h-full w-full p-6 mt-16">
          <WalletInfo />
          <AmountInput amount={amount} setAmount={setAmount} />
          <RecipientInput
            recipientAddress={recipientAddress}
            setRecipientAddress={setRecipientAddress}
          />
          <SendButton onPress={handleSendTransaction} isPending={isPending} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default TransferScreen;
