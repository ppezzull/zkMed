'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';

export default function RegisterPage() {
  const router = useRouter();
  const account = useActiveAccount();

  // Simple redirect logic - just go to role selection if wallet is connected
  useEffect(() => {
    if (account?.address) {
      router.replace('/register/role-selection');
    } else {
      router.replace('/');
    }
  }, [account?.address, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-gray-600 text-sm">
          {account?.address ? 'Taking you to registration...' : 'Please connect your wallet...'}
        </p>
      </div>
    </div>
  );
} 