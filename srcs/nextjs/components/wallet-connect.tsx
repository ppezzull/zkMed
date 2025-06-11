'use client';

import { ConnectButton } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';

interface WalletConnectProps {
  variant?: 'header' | 'full';
}

export default function WalletConnect({ variant = 'full' }: WalletConnectProps) {
  const { 
    account, 
    isConnected, 
    shortAddress, 
    disconnect, 
    wallets, 
    client, 
    chain 
  } = useWallet();

  // Header variant - compact for navigation
  if (variant === 'header') {
    if (!isConnected) {
      return (
        <ConnectButton
          client={client}
          wallets={wallets}
          chain={chain}
          connectButton={{
            label: "Connect Wallet",
            style: {
              backgroundColor: "#0066CC",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            },
          }}
          connectModal={{
            title: "Connect to zkMed",
            titleIcon: "🏥",
          }}
        />
      );
    }

    return (
      <Button
        onClick={disconnect}
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        {shortAddress}
      </Button>
    );
  }

  // Full variant - detailed for pages
  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">
        Connect Your Wallet
      </h2>
      
      {!isConnected ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Connect your wallet to access zkMed with gasless transactions
          </p>
          <ConnectButton
            client={client}
            wallets={wallets}
            chain={chain}
            connectButton={{
              label: "Connect Wallet",
              style: {
                backgroundColor: "#0066CC",
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
            Address: {account?.address.slice(0, 8)}...{account?.address.slice(-6)}
          </p>
          <p className="text-xs text-blue-600 mb-4">
            🚀 Gas abstraction enabled - Enjoy gasless transactions!
          </p>
          <Button
            onClick={disconnect}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            Disconnect
          </Button>
        </div>
      )}
      
      {isConnected && (
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
