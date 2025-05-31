// User Registration Component
// filepath: /components/UserRegistration.tsx

'use client';

import { useState } from 'react';
import { 
  useActiveAccount, 
  useReadContract, 
  useSendTransaction,
  useThirdwebClient
} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { getRegistrationContract } from '../lib/contracts';

type UserRole = 'Patient' | 'Doctor' | 'Organization';

export function UserRegistration() {
  const client = useThirdwebClient();
  const account = useActiveAccount();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Patient');
  const [isLoading, setIsLoading] = useState(false);
  
  const registrationContract = getRegistrationContract(client);
  const { mutate: sendTransaction } = useSendTransaction();

  // Check current user status
  const { data: userRole } = useReadContract({
    contract: registrationContract,
    method: 'getUserRole',
    params: account?.address ? [account.address] : undefined,
  });

  const { data: isVerified } = useReadContract({
    contract: registrationContract,
    method: 'isUserVerified',
    params: account?.address ? [account.address] : undefined,
  });

  const handleRegistration = async () => {
    if (!account?.address) return;
    
    setIsLoading(true);
    
    try {
      let transaction;
      
      switch (selectedRole) {
        case 'Patient':
          transaction = prepareContractCall({
            contract: registrationContract,
            method: 'registerAsPatient',
            params: [],
          });
          break;
          
        case 'Doctor':
          transaction = prepareContractCall({
            contract: registrationContract,
            method: 'registerAsDoctor',
            params: [],
          });
          break;
          
        case 'Organization':
          transaction = prepareContractCall({
            contract: registrationContract,
            method: 'registerAsOrganization',
            params: [],
          });
          break;
      }

      sendTransaction(transaction, {
        onSuccess: () => {
          console.log('Registration successful!');
        },
        onError: (error) => {
          console.error('Registration failed:', error);
        },
      });
    } catch (error) {
      console.error('Transaction preparation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplay = (role: number) => {
    const roles = ['Unregistered', 'Patient', 'Doctor', 'Organization', 'Admin'];
    return roles[role] || 'Unknown';
  };

  if (!account) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please connect your wallet to register</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">User Registration</h2>
      
      {/* Current Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Status</h3>
        <p className="text-sm text-gray-600">
          Role: {userRole !== undefined ? getRoleDisplay(Number(userRole)) : 'Loading...'}
        </p>
        <p className="text-sm text-gray-600">
          Verified: {isVerified !== undefined ? (isVerified ? 'Yes' : 'No') : 'Loading...'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Address: {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </p>
      </div>

      {/* Registration Form */}
      {userRole === 0 && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Organization">Organization</option>
            </select>
          </div>

          <button
            onClick={handleRegistration}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isLoading ? 'Registering...' : `Register as ${selectedRole}`}
          </button>
        </div>
      )}

      {userRole !== 0 && userRole !== undefined && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            You are already registered as {getRoleDisplay(Number(userRole))}
          </p>
        </div>
      )}
    </div>
  );
}
