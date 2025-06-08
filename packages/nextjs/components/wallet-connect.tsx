'use client';

import { ConnectButton, useActiveAccount, useActiveWallet, useDisconnect } from 'thirdweb/react';
import { client, mantleFork } from './providers/thirdweb-providers';
import { createWallet, inAppWallet, smartWallet } from 'thirdweb/wallets';

// Configure wallets with smart wallet for gas abstraction
const smartWalletOptions = smartWallet({
  chain: mantleFork,
  factoryAddress: process.env.NEXT_PUBLIC_SMART_WALLET_FACTORY_ADDRESS, // Default smart wallet factory
  gasless: true, // Enable gasless transactions
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
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  const handleDisconnect = async () => {
    if (wallet) {
      await disconnect(wallet);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">
        Connect Your Wallet
      </h2>
      
      {!account ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Connect your wallet to access zkMed with gasless transactions
          </p>
          <ConnectButton
            client={client}
            wallets={wallets}
            chain={mantleFork}
            connectButton={{
              label: "Connect Wallet",
              style: {
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
              },
            }}
            connectModal={{
              title: "Connect to zkMed",
              titleIcon: "🏥",
            }}
          />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-green-600 mb-2">✅ Connected</p>
          <p className="text-sm text-gray-600 mb-2">
            Address: {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </p>
          <p className="text-xs text-blue-600 mb-4">
            🚀 Gas abstraction enabled - Enjoy gasless transactions!
          </p>
          <button
            onClick={handleDisconnect}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
      
      {account && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-medium">Smart Wallet Features:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Gasless transactions</li>
            <li>Account abstraction</li>
            <li>Enhanced security</li>
            <li>Session management</li>
          </ul>
        </div>
      )}
    </div>
  );
}
