// Email Verification Component
// filepath: /components/EmailVerification.tsx

'use client';

import { useState } from 'react';
import { 
  useActiveAccount, 
  useReadContract, 
  useSendTransaction,
  useThirdwebClient
} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { getEmailDomainProverContract, getRegistrationContract } from '../lib/contracts';

export function EmailVerification() {
  const client = useThirdwebClient();
  const account = useActiveAccount();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'input' | 'generating' | 'submitting'>('input');
  
  const emailDomainContract = getEmailDomainProverContract(client);
  const registrationContract = getRegistrationContract(client);
  const { mutate: sendTransaction } = useSendTransaction();

  // Check if user is already verified
  const { data: isVerified } = useReadContract({
    contract: registrationContract,
    method: 'isUserVerified',
    params: account?.address ? [account.address] : undefined,
  });

  // Check email hash status
  const { data: emailHashExists } = useReadContract({
    contract: registrationContract,
    method: 'emailHashExists',
    params: email ? [email] : undefined,
  });

  const handleEmailVerification = async () => {
    if (!account?.address || !email) return;

    setIsLoading(true);
    setVerificationStep('generating');

    try {
      // Step 1: Generate vlayer proof (simulated for demo)
      // In a real implementation, this would call the vlayer API
      console.log('Generating vlayer proof for email:', email);
      
      // Simulate proof generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationStep('submitting');

      // Step 2: Submit verification to contract
      // This is a simplified example - in reality, you'd need the actual vlayer proof
      const transaction = prepareContractCall({
        contract: emailDomainContract,
        method: 'verifyEmailDomain',
        params: [
          email,
          account.address, // user address
          '0x1234...', // placeholder for vlayer proof
        ],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          console.log('Email verification successful!');
          setVerificationStep('input');
        },
        onError: (error) => {
          console.error('Email verification failed:', error);
          setVerificationStep('input');
        },
      });
    } catch (error) {
      console.error('Verification process failed:', error);
      setVerificationStep('input');
    } finally {
      setIsLoading(false);
    }
  };

  const extractDomain = (email: string) => {
    return email.split('@')[1] || '';
  };

  if (!account) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please connect your wallet to verify email</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Email Verification</h2>
      
      {/* Current Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Verification Status</h3>
        <p className="text-sm text-gray-600">
          Verified: {isVerified !== undefined ? (isVerified ? 'Yes' : 'No') : 'Loading...'}
        </p>
        {email && (
          <p className="text-sm text-gray-600">
            Domain: {extractDomain(email)}
          </p>
        )}
      </div>

      {!isVerified && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@hospital.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            {emailHashExists && (
              <p className="text-xs text-red-600 mt-1">
                This email is already registered
              </p>
            )}
          </div>

          {/* vlayer Integration Info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-1">vlayer Integration</h4>
            <p className="text-xs text-blue-700">
              This will generate a zero-knowledge proof of your email domain using vlayer,
              ensuring privacy while verifying your institutional affiliation.
            </p>
          </div>

          <button
            onClick={handleEmailVerification}
            disabled={isLoading || !email || emailHashExists}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {verificationStep === 'generating' && 'Generating Proof...'}
            {verificationStep === 'submitting' && 'Submitting to Blockchain...'}
            {verificationStep === 'input' && 'Verify Email Domain'}
          </button>

          {verificationStep === 'generating' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                📧 Generating vlayer proof for domain verification...
              </p>
            </div>
          )}

          {verificationStep === 'submitting' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                ⛓️ Submitting verification to smart contract...
              </p>
            </div>
          )}
        </div>
      )}

      {isVerified && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            ✅ Your email domain has been verified!
          </p>
        </div>
      )}
    </div>
  );
}
