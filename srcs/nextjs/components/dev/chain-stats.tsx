'use client';

import { useActiveAccount } from 'thirdweb/react';
import { mantleFork } from '@/utils/configs/chain-config';

export default function ChainStats() {
  const account = useActiveAccount();

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium">🔧 Development Mode</span>
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      </div>
      <div className="space-y-1">
        <p><span className="font-medium">Network:</span> {mantleFork.name}</p>
        <p><span className="font-medium">Chain ID:</span> {mantleFork.id}</p>
        <p><span className="font-medium">RPC:</span> Anvil Mantle Fork (via proxy)</p>
        <p><span className="font-medium">Status:</span> Connected to Anvil Mantle Fork</p>
        {account && (
          <>
            <p><span className="font-medium">Smart Wallet:</span> Gas abstraction enabled</p>
            <p><span className="font-medium">Account:</span> {account.address.slice(0, 8)}...{account.address.slice(-6)}</p>
          </>
        )}
      </div>
    </div>
  );
} 