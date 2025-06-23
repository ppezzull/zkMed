'use client';

import { ConnectButton } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
import { client } from '@/utils/thirdweb/client';
import { createWallet, inAppWallet, smartWallet } from 'thirdweb/wallets';
import { mantleFork } from '@/lib/configs/chain-config';
import { useActiveAccount } from 'thirdweb/react';
import { useState, useEffect } from 'react';

import {
  generatePayload,
  isLoggedIn, 
  login,
  logout,
} from "@/lib/actions/auth";

const smartWalletOptions = smartWallet({
  chain: mantleFork,
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

export default function WalletConnect() {
  const account = useActiveAccount();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Check authentication status when account changes
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!account?.address) {
        setIsAuthenticated(false);
        return;
      }

      setIsCheckingAuth(true);
      try {
        const loggedIn = await isLoggedIn();
        setIsAuthenticated(loggedIn);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [account?.address]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <Button variant="outline" disabled>
        Checking...
      </Button>
    );
  }

  // Show logout button if authenticated
  if (account?.address && isAuthenticated) {
    const shortAddress = `${account.address.slice(0, 6)}...${account.address.slice(-4)}`;
    return (
      <Button
        onClick={handleLogout}
        variant="outline"
        className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ease-in-out"
      >
        {shortAddress}
      </Button>
    );
  }

  // Show connect button if not authenticated
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={mantleFork}
      connectButton={{
        label: "Connect Wallet",
        className: "btn inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
      }}
      connectModal={{
        title: "Connect to zkMed",
      }}
      auth={{
        isLoggedIn: async (address) => {
          console.log("checking if logged in!", { address });
          return await isLoggedIn();
        },
        doLogin: async (params) => {
          console.log("logging in!");
          await login(params);
          setIsAuthenticated(true);
        },
        getLoginPayload: async ({ address }) =>
          generatePayload({ address }),
        doLogout: async () => {
          console.log("logging out!");
          await logout();
          setIsAuthenticated(false);
        },
      }}
    />
  );
}
