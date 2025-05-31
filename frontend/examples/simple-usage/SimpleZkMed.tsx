// Simplified zkMed Component using custom hooks
// filepath: /components/SimpleZkMed.tsx

'use client';

import { ConnectButton } from 'thirdweb/react';
import { 
  useZkMed, 
  useUserInfo, 
  useRoleHelpers,
  useVlayerProof 
} from '../hooks/useZkMed';
import { useState } from 'react';

export function SimpleZkMed() {
  const { 
    registerAsPatient, 
    registerAsDoctor, 
    verifyEmail,
    account, 
    isConnected 
  } = useZkMed();
  
  const { userInfo, isLoading } = useUserInfo();
  const { getRoleName, getRoleColor, canRegister } = useRoleHelpers();
  const { generateEmailProof } = useVlayerProof();
  
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEmailVerification = async () => {
    if (!email) return;
    
    setIsVerifying(true);
    try {
      const proof = await generateEmailProof(email);
      await verifyEmail(email, proof);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Welcome to zkMed</h2>
        <p className="mb-6">Connect your wallet to get started</p>
        <ConnectButton />
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center p-8">Loading user information...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">zkMed Dashboard</h1>
        <ConnectButton />
      </div>

      {/* User Status */}
      {userInfo && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold mb-2">Your Status</h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userInfo.role)}`}>
            {getRoleName(userInfo.role)}
          </span>
          <p className="text-sm text-gray-600 mt-2">
            Verified: {userInfo.isVerified ? '✅' : '❌'}
          </p>
        </div>
      )}

      {/* Registration */}
      {userInfo && canRegister(userInfo.role) && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold mb-4">Register Your Account</h3>
          <div className="space-y-2">
            <button
              onClick={registerAsPatient}
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Register as Patient
            </button>
            <button
              onClick={registerAsDoctor}
              className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Register as Doctor
            </button>
          </div>
        </div>
      )}

      {/* Email Verification */}
      {userInfo && !userInfo.isVerified && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold mb-4">Verify Your Email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@hospital.com"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleEmailVerification}
            disabled={!email || isVerifying}
            className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>
      )}

      {/* Success State */}
      {userInfo && userInfo.isVerified && userInfo.role > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800">✅ All Set!</h3>
          <p className="text-green-700 text-sm">
            You're registered and verified. Welcome to zkMed!
          </p>
        </div>
      )}
    </div>
  );
}
