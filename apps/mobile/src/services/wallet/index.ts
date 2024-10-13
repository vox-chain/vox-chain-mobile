import { ethers } from '@/lib/ethers';
import AsyncStore from '~/src/lib/AsyncStore';
import { SECURE_KEYS, STORAGE_KEYS } from '~/src/lib/constants';
import secureStore from '~/src/lib/secureStore';
import { AppError } from '~/src/lib/utils';

/**
 * restoreWalletFromPhrase - Function to restore wallet from mnemonic phrase
 * @param mnemonicPhrase Secret phrase to restore wallet
 * @returns {Promise<ethers.HDNodeWallet>} Wallet object
 * @throws {AppError} If mnemonic phrase is empty or invalid
 */
async function restoreWalletFromPhrase(mnemonicPhrase: string): Promise {
  if (!mnemonicPhrase) throw new AppError('Mnemonic phrase cannot be empty');

  if (!ethers.Mnemonic.isValidMnemonic(mnemonicPhrase))
    throw new AppError('Invalid mnemonic phrase');

  const wallet = ethers.HDNodeWallet.fromPhrase(mnemonicPhrase);
  await saveWalletData(wallet);
  return wallet;
}

const saveWalletData = async (wallet: ethers.HDNodeWallet) => {
  await secureStore.setAuthenticatedPrivateKey(wallet.privateKey);
  await Promise.all([
    AsyncStore.setStorageValue(STORAGE_KEYS.HAS_PRIVATE_KEY, 'true'),
    AsyncStore.setStorageValue(STORAGE_KEYS.ADDRESS, wallet.address),
    secureStore.setValue(SECURE_KEYS.PHRASE_KEY, wallet.mnemonic?.phrase || ''),
  ]);
};

// Function to create a new wallet
async function createNewWallet() {
  const start = Date.now();
  const wallet = ethers.Wallet.createRandom();
  const end = Date.now();
  console.log('Time to create wallet:', (end - start) / 1000, 's');
  await saveWalletData(wallet);
  return wallet;
}

// Function to get wallet address (doesn't require authentication)
async function getWalletAddress(): Promise {
  try {
    const privateKey = await secureStore.getPrivateKey();
    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey);
      return wallet.address;
    }
    return null;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return null;
  }
}

// Function to use the wallet (requires authentication)
async function getWallet(): Promise {
  const privateKey = await secureStore.getAuthenticatedPrivateKey();
  if (privateKey) {
    return new ethers.Wallet(privateKey);
  }
  return null;
}

// Example usage functions

// Setup: Create a new wallet
async function setupWallet(): Promise {
  const newAddress = await createNewWallet();
  if (newAddress) {
    console.log('New wallet created with address:', newAddress);
  } else {
    console.log('Failed to create new wallet');
  }
}

// Usage: Get wallet address (no authentication required)
async function displayWalletAddress(): Promise {
  const address = await getWalletAddress();
  if (address) {
    console.log('Wallet address:', address);
  } else {
    console.log('No wallet found or error occurred');
  }
}

// Usage: Perform an authenticated action with the wallet
async function performWalletAction(): Promise {
  const wallet = await getWallet();
  if (wallet) {
    console.log('Authenticated. Wallet address:', wallet.address);
    // Perform your wallet action here
    // Example: const balance = await wallet.getBalance();
  } else {
    console.log('Authentication failed or wallet not found');
  }
}

// Export the functions you want to use in other parts of your app
export {
  createNewWallet,
  displayWalletAddress,
  getWallet,
  getWalletAddress,
  performWalletAction,
  restoreWalletFromPhrase,
  setupWallet,
};
