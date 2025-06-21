'use client';

import { useActiveAccount, useActiveWallet, useDisconnect } from 'thirdweb/react';
import { client, getClientChain } from '../components/providers/thirdweb-providers';
import { createWallet, inAppWallet, smartWallet } from 'thirdweb/wallets';
import { useCallback } from 'react';

// Get the appropriate chain for client-side operations
const clientChain = getClientChain();

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
}

export interface WalletActions {
  disconnect: () => Promise<void>;
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

  const isConnected = !!account;
  const address = account?.address || null;
  const shortAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const disconnect = useCallback(async () => {
    if (wallet) {
      await thirdwebDisconnect(wallet);
    }
  }, [wallet, thirdwebDisconnect]);

  return {
    // State
    account,
    wallet,
    isConnected,
    address,
    shortAddress,
    
    // Actions
    disconnect,
    
    // Configuration
    wallets,
    client,
    chain: clientChain,
  };
}
