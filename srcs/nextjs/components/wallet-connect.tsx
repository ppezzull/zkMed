'use client';

import { ConnectButton } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
import { server } from '@/utils/thirdweb/server';
import { createWallet, inAppWallet, smartWallet } from 'thirdweb/wallets';
import { mantleFork } from '@/lib/configs/chain-config';

import {
  generatePayload,
  isLoggedIn, 
  login,
  logout,
} from "@/lib/actions/auth"; // we'll create this file in the next section

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
  if (!isLoggedIn()) {
    return (
      <ConnectButton
        client={server}
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
          },
          getLoginPayload: async ({ address }) =>
            generatePayload({ address }),
          doLogout: async () => {
            console.log("logging out!");
            await logout();
          },
        }}
      />
    );
  }

  return (
    <Button
      onClick={logout}
      variant="outline"
      className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ease-in-out"
    >
      {/* {shortAddress} */}
      dajeroma
    </Button>
  );
}
