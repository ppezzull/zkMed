"use client";

import { useEffect, useState } from "react";
import { Button } from "~~/components/ui/button";

export default function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before rendering to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConnect = () => {
    // For demo purposes, simulate wallet connection
    const mockAddress = "0x1234567890123456789012345678901234567890";
    setWalletAddress(mockAddress);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setIsConnected(false);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <Button
        variant="outline"
        disabled
        className="btn inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-2 px-4 rounded-lg"
      >
        Loading...
      </Button>
    );
  }

  // Show disconnect button if connected
  if (isConnected && walletAddress) {
    const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    return (
      <Button
        onClick={handleDisconnect}
        variant="outline"
        className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ease-in-out"
      >
        {shortAddress}
      </Button>
    );
  }

  // Show connect button
  return (
    <Button
      onClick={handleConnect}
      className="btn inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      style={{
        fontSize: "16px",
        height: "50px",
        minWidth: "165px",
      }}
    >
      Connect Wallet
    </Button>
  );
}
