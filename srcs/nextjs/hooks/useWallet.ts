'use client';

import { useActiveAccount, useActiveWallet, useDisconnect } from 'thirdweb/react';
import { client, getClientChain } from '../components/providers/thirdweb-providers';
import { createWallet, inAppWallet, smartWallet } from 'thirdweb/wallets';
import { useCallback, useState, useEffect } from 'react';
import { 
  prepareTransaction, 
  sendAndConfirmTransaction,
  getRpcClient
} from 'thirdweb';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { toEther, toWei } from 'thirdweb/utils';

// Get the appropriate chain for client-side operations
const clientChain = getClientChain();

// Anvil's default pre-funded account private key
const ANVIL_DEFAULT_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// Configure wallets with smart wallet for gas abstraction
const smartWalletOptions = smartWallet({
  chain: clientChain,
  factoryAddress: process.env.NEXT_PUBLIC_SMART_WALLET_FACTORY_ADDRESS,
  gasless: true,
});

const wallets = [
  smartWalletOptions,
  inAppWallet({
    auth: {
      options: ["email", "google", "apple", "facebook"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

export interface WalletState {
  account: ReturnType<typeof useActiveAccount>;
  wallet: ReturnType<typeof useActiveWallet>;
  isConnected: boolean;
  address: string | null;
  shortAddress: string | null;
  balance: bigint;
  isLoading: boolean;
  isFunding: boolean;
  isReady: boolean;
}

export interface WalletActions {
  disconnect: () => Promise<void>;
  fetchBalance: () => Promise<void>;
  fundWallet: (amount: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

export interface UseWalletReturn extends WalletState, WalletActions {
  wallets: typeof wallets;
  client: typeof client;
  chain: typeof clientChain;
}

export function useWallet(): UseWalletReturn {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect: thirdwebDisconnect } = useDisconnect();

  // State management
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const isConnected = !!account;
  const address = account?.address || null;
  const shortAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  // Fetch wallet balance
  const fetchBalance = useCallback(async () => {
    if (!account?.address) {
      setBalance(BigInt(0));
      setIsReady(true);
      return;
    }

    setIsLoading(true);
    try {
      const rpc = getRpcClient({ client, chain: clientChain });
      const balanceHex = await rpc({
        method: 'eth_getBalance',
        params: [account.address, 'latest'],
      });
      setBalance(BigInt(balanceHex));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(BigInt(0));
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  }, [account?.address]);

  // Fund wallet with specified amount
  const fundWallet = useCallback(async (amount: string) => {
    if (!account?.address) return;

    setIsFunding(true);
    try {
      // Create account from Anvil's default private key
      const fundingAccount = privateKeyToAccount({ 
        client,
        privateKey: ANVIL_DEFAULT_PRIVATE_KEY 
      });

      // Prepare the funding transaction
      const transaction = prepareTransaction({
        client,
        chain: clientChain,
        to: account.address,
        value: toWei(amount),
      });

      // Send the funding transaction
      const result = await sendAndConfirmTransaction({
        transaction,
        account: fundingAccount,
      });

      console.log('Funding successful:', result);
      
      // Refresh balance after funding
      setTimeout(fetchBalance, 2000);
    } catch (error) {
      console.error('Funding failed:', error);
      throw error;
    } finally {
      setIsFunding(false);
    }
  }, [account?.address, fetchBalance]);

  // Refresh balance manually
  const refreshBalance = useCallback(async () => {
    await fetchBalance();
  }, [fetchBalance]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (wallet) {
      await thirdwebDisconnect(wallet);
      setBalance(BigInt(0));
      setIsReady(false);
    }
  }, [wallet, thirdwebDisconnect]);

  // Effect to fetch balance when account changes
  useEffect(() => {
    setIsReady(false);
    fetchBalance();
  }, [fetchBalance]);

  return {
    // State
    account,
    wallet,
    isConnected,
    address,
    shortAddress,
    balance,
    isLoading,
    isFunding,
    isReady,
    
    // Actions
    disconnect,
    fetchBalance,
    fundWallet,
    refreshBalance,
    
    // Configuration
    wallets,
    client,
    chain: clientChain,
  };
}
