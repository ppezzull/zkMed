// Role Management Component
// filepath: /components/RoleManagement.tsx

'use client';

import { 
  useActiveAccount, 
  useReadContract, 
  useThirdwebClient
} from 'thirdweb/react';
import { getRegistrationContract } from '../lib/contracts';

export function RoleManagement() {
  const client = useThirdwebClient();
  const account = useActiveAccount();
  
  const registrationContract = getRegistrationContract(client);

  // Read user data
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

  const { data: registrationTime } = useReadContract({
    contract: registrationContract,
    method: 'getRegistrationTime',
    params: account?.address ? [account.address] : undefined,
  });

  // Get role display
  const getRoleDisplay = (role: number) => {
    const roles = ['Unregistered', 'Patient', 'Doctor', 'Organization', 'Admin'];
    return roles[role] || 'Unknown';
  };

  const getRoleColor = (role: number) => {
    const colors = {
      0: 'bg-gray-100 text-gray-800', // Unregistered
      1: 'bg-blue-100 text-blue-800', // Patient
      2: 'bg-green-100 text-green-800', // Doctor
      3: 'bg-purple-100 text-purple-800', // Organization
      4: 'bg-red-100 text-red-800', // Admin
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (timestamp: bigint) => {
    if (!timestamp) return 'Not registered';
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  if (!account) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please connect your wallet to view role information</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Role Management</h2>
      
      {/* User Information */}
      <div className="space-y-4">
        {/* Wallet Address */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Wallet Address</h3>
          <p className="text-xs font-mono text-gray-600 break-all">
            {account.address}
          </p>
        </div>

        {/* Role Information */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Role</h3>
          {userRole !== undefined ? (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(Number(userRole))}`}>
              {getRoleDisplay(Number(userRole))}
            </span>
          ) : (
            <span className="text-gray-500">Loading...</span>
          )}
        </div>

        {/* Verification Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Verification Status</h3>
          {isVerified !== undefined ? (
            <div className="flex items-center space-x-2">
              {isVerified ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-700 text-sm">Verified</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-red-700 text-sm">Not Verified</span>
                </>
              )}
            </div>
          ) : (
            <span className="text-gray-500">Loading...</span>
          )}
        </div>

        {/* Registration Date */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Registration Date</h3>
          <p className="text-sm text-gray-600">
            {registrationTime !== undefined ? formatDate(registrationTime) : 'Loading...'}
          </p>
        </div>

        {/* Role Permissions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Role Permissions</h3>
          {userRole !== undefined && (
            <div className="text-xs text-blue-700 space-y-1">
              {Number(userRole) === 0 && (
                <p>• No permissions - please register for an account</p>
              )}
              {Number(userRole) === 1 && (
                <>
                  <p>• View medical records</p>
                  <p>• Book appointments</p>
                  <p>• Access patient portal</p>
                </>
              )}
              {Number(userRole) === 2 && (
                <>
                  <p>• View patient records</p>
                  <p>• Create medical records</p>
                  <p>• Prescribe medications</p>
                  <p>• Access doctor portal</p>
                </>
              )}
              {Number(userRole) === 3 && (
                <>
                  <p>• Manage organization data</p>
                  <p>• Verify staff members</p>
                  <p>• Access organization portal</p>
                </>
              )}
              {Number(userRole) === 4 && (
                <>
                  <p>• Full system access</p>
                  <p>• Manage all users</p>
                  <p>• System administration</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
