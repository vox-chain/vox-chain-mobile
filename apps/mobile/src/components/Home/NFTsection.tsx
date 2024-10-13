import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';

import { useWallet } from '../../context/WalletContext'; // Adjust the path based on your project structure

interface NFT {
  name: string;
  description: string;
  image: string;
  tokenId: string;
  contractAddress: string;
}

const NFTsection: React.FC = () => {
  const { address } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        if (!address) return;

        //const apiKey = API_KEYS.AlchemyApiKey;
        const apiKey = 'J8xjc0Pmc4Lc7r0WI3dFiEbrwzqe0Gai';
        const response = await axios.get(
          `https://eth-mainnet.g.alchemy.com/v2/${apiKey}/getNFTs/?owner=${address}`
        );

        const nftData = response.data.ownedNfts.map((nft: any) => ({
          name: nft.metadata.name,
          description: nft.metadata.description,
          image: nft.metadata.image,
          tokenId: nft.id.tokenId,
          contractAddress: nft.contract.address,
        }));

        setNfts(nftData);
        console.log('NFTs Data :', nftData);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {nfts.length === 0 ? (
        <Text style={styles.noNftsText}>There are no NFTs to show</Text>
      ) : (
        <FlatList
          data={nfts}
          keyExtractor={(item) => `${item.contractAddress}-${item.tokenId}`}
          renderItem={({ item }) => (
            <View style={styles.nftCard}>
              <Image source={{ uri: item.image }} style={styles.nftImage} />
              <Text style={styles.nftName}>{item.name}</Text>
              <Text style={styles.nftDescription}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  noNftsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nftCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  nftImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  nftName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  nftDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default NFTsection;
