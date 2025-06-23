'use client';

import { ConnectButton } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/types/healthcare';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  
  const registration = useHealthcareRegistration();
  const router = useRouter();
  const [hasCheckedRegistration, setHasCheckedRegistration] = useState(false);

  // // Check user role when wallet connects
  // useEffect(() => {
  //   if (isConnected && account?.address && !registration.loading && !hasCheckedRegistration) {
  //     registration.checkUserRole().then(() => {
  //       setHasCheckedRegistration(true);
  //     });
  //   }
  // }, [isConnected, account?.address, registration.loading, hasCheckedRegistration]);

  // Handle user redirection based on role
  useEffect(() => {
    if (hasCheckedRegistration && isConnected) {
      if (registration.isRegistered && registration.userRole !== null) {
        // Redirect to role-specific page
        if (registration.userRole === UserType.PATIENT) {
          router.push(`/patient/${account?.address}`);
        } else if (registration.userRole === UserType.HOSPITAL) {
          router.push(`/hospital/${account?.address}`);
        } else if (registration.userRole === UserType.INSURER) {
          router.push(`/insurance/${account?.address}`);
        }
      }
        // TODO: Add admin check and redirect to /admin
      // } else if (registration.isRegistered === false) {
      //   // User is not registered, redirect to registration page
      //   router.push('/register/role-selection');
      // }
    }
  }, [hasCheckedRegistration, isConnected, registration.isRegistered, registration.userRole, account?.address, router]);

  // // Reset check when wallet disconnects
  // useEffect(() => {
  //   if (!isConnected) {
  //     setHasCheckedRegistration(false);
  //   }
  // }, [isConnected]);

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
            className: "btn inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          }}
          connectModal={{
            title: "Connect to zkMed",
          }}
        />
      );
    }

    return (
      <Button
        onClick={disconnect}
        variant="outline"
        className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ease-in-out"
      >
        {shortAddress}
      </Button>
    );
  }

  // Full variant - detailed for pages
  return (
    <div className="flex flex-col items-center gap-6 p-8 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
          <span className="text-white text-2xl">🏥</span>
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-slate-600">
          Join zkMed's privacy-preserving healthcare platform
        </p>
      </div>
      
      {!isConnected ? (
        <div className="text-center w-full">
          <p className="text-slate-600 mb-6 leading-relaxed">
            Connect your wallet to access zkMed with gasless transactions, 
            privacy-preserving claims, and yield-generating insurance pools.
          </p>
          <ConnectButton
            client={client}
            wallets={wallets}
            chain={chain}
            connectButton={{
              label: "Connect Wallet",
              className: "btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-lg",
            }}
            connectModal={{
              title: "Connect to zkMed",
            }}
          />
          
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Gas abstraction
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Privacy-first
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Zero-knowledge
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Yield earning
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center w-full">
          {/* Show loading state while checking registration */}
          {(
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
              <p className="text-emerald-700 font-medium mb-2">✅ Successfully Connected</p>
              <p className="text-sm text-emerald-600 mb-2">
                Address: <span className="font-mono">{account?.address.slice(0, 8)}...{account?.address.slice(-6)}</span>
              </p>
              <p className="text-xs text-emerald-600">
                🚀 Smart wallet enabled - Enjoy gasless healthcare transactions!
              </p>
              {/* {hasCheckedRegistration && (
                <p className="text-xs text-emerald-600 mt-1">
                  {registration.isRegistered ? '🏥 Redirecting to your dashboard...' : '📝 Redirecting to registration...'}
                </p>
              )} */}
            </div>
          )}
          
          <Button
            onClick={disconnect}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-200"
          >
            Disconnect Wallet
          </Button>
        </div>
      )}
      
      {isConnected && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 w-full">
          <p className="font-medium text-blue-900 mb-3">🛡️ Smart Wallet Features Active:</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-blue-800">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Gasless transactions
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Account abstraction
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Enhanced security
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Session management
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
