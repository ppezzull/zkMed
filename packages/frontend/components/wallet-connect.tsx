'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function WalletConnect() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || authenticated;

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">
        Connect Your Wallet
      </h2>
      
      {!authenticated ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Connect your wallet to access zkMed
          </p>
          <button
            disabled={disableLogin}
            onClick={login}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {ready ? 'Connect Wallet' : 'Loading...'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-green-600 mb-2">✅ Connected</p>
          {user?.wallet?.address && (
            <p className="text-sm text-gray-600 mb-4">
              Address: {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
            </p>
          )}
          {user?.email?.address && (
            <p className="text-sm text-gray-600 mb-4">
              Email: {user.email.address}
            </p>
          )}
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
