// Organization Verification Component
// filepath: /components/OrganizationVerification.tsx

'use client';

import { useState } from 'react';
import { 
  useActiveAccount, 
  useReadContract, 
  useSendTransaction,
  useThirdwebClient
} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { getEmailDomainProverContract } from '../lib/contracts';

export function OrganizationVerification() {
  const client = useThirdwebClient();
  const account = useActiveAccount();
  const [domain, setDomain] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const emailDomainContract = getEmailDomainProverContract(client);
  const { mutate: sendTransaction } = useSendTransaction();

  // Check if domain is already verified
  const { data: isDomainVerified } = useReadContract({
    contract: emailDomainContract,
    method: 'isDomainVerified',
    params: domain ? [domain] : undefined,
  });

  // Get organization info for domain
  const { data: orgInfo } = useReadContract({
    contract: emailDomainContract,
    method: 'getOrganizationByDomain',
    params: domain ? [domain] : undefined,
  });

  const handleOrganizationVerification = async () => {
    if (!account?.address || !domain || !organizationName) return;

    setIsLoading(true);

    try {
      // In a real implementation, this would involve:
      // 1. Generating vlayer proof for organization domain ownership
      // 2. Submitting the proof to the contract
      
      const transaction = prepareContractCall({
        contract: emailDomainContract,
        method: 'verifyOrganization',
        params: [
          domain,
          organizationName,
          account.address,
          '0x1234...', // placeholder for vlayer proof
        ],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          console.log('Organization verification successful!');
        },
        onError: (error) => {
          console.error('Organization verification failed:', error);
        },
      });
    } catch (error) {
      console.error('Verification process failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please connect your wallet to verify organization</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Organization Verification</h2>
      
      {/* Domain Status */}
      {domain && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Domain Status</h3>
          <p className="text-sm text-gray-600">
            Domain: {domain}
          </p>
          <p className="text-sm text-gray-600">
            Verified: {isDomainVerified !== undefined ? (isDomainVerified ? 'Yes' : 'No') : 'Loading...'}
          </p>
          {orgInfo && (
            <p className="text-sm text-gray-600">
              Organization: {orgInfo.name || 'Not registered'}
            </p>
          )}
        </div>
      )}

      {!isDomainVerified && (
        <div className="space-y-4">
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="General Hospital"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Domain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Domain
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="hospital.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your organization's email domain (without @)
            </p>
          </div>

          {/* Verification Process Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Verification Process</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>1. Domain ownership will be verified using vlayer</p>
              <p>2. Organization details will be stored on-chain</p>
              <p>3. Authorized staff can then register with this domain</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleOrganizationVerification}
            disabled={isLoading || !domain || !organizationName}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isLoading ? 'Verifying Organization...' : 'Verify Organization'}
          </button>
        </div>
      )}

      {isDomainVerified && orgInfo && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-green-800 font-semibold mb-2">✅ Organization Verified</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Name:</strong> {orgInfo.name}</p>
            <p><strong>Domain:</strong> {domain}</p>
            <p><strong>Verifier:</strong> {orgInfo.verifier?.slice(0, 6)}...{orgInfo.verifier?.slice(-4)}</p>
          </div>
        </div>
      )}

      {/* Additional Organization Features */}
      {isDomainVerified && (
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h4 className="text-sm font-semibold text-indigo-800 mb-2">Organization Features</h4>
          <div className="text-xs text-indigo-700 space-y-1">
            <p>• Staff can register using @{domain} emails</p>
            <p>• Automatic domain-based verification</p>
            <p>• Organization-specific permissions</p>
            <p>• Centralized staff management</p>
          </div>
        </div>
      )}
    </div>
  );
}
