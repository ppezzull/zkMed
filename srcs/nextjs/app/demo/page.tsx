'use client';

import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { useActiveAccount } from 'thirdweb/react';
import { UserType } from '@/utils/types/healthcare';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import WalletConnect from '@/components/wallet-connect';

export default function DemoPage() {
  const account = useActiveAccount();
  const registration = useHealthcareRegistration();

  const getUserTypeLabel = (userType: UserType | null) => {
    switch (userType) {
      case UserType.PATIENT:
        return { label: 'Patient', color: 'bg-blue-100 text-blue-800', icon: '👤' };
      case UserType.HOSPITAL:
        return { label: 'Hospital', color: 'bg-green-100 text-green-800', icon: '🏥' };
      case UserType.INSURER:
        return { label: 'Insurance Company', color: 'bg-purple-100 text-purple-800', icon: '🛡️' };
      default:
        return { label: 'Not Registered', color: 'bg-gray-100 text-gray-800', icon: '❓' };
    }
  };

  const getStepColor = (step: string) => {
    if (step.includes('successful') || step.includes('Success')) {
      return 'bg-green-100 text-green-800';
    }
    if (step.includes('failed') || step.includes('Error')) {
      return 'bg-red-100 text-red-800';
    }
    if (step.includes('Loading') || step.includes('Registering') || step.includes('Processing')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 zkMed Registration Hook Demo
          </h1>
          <p className="text-gray-600">
            Live demonstration of the useHealthcareRegistration hook functionality
          </p>
        </div>

        {/* Wallet Connection */}
        {!account?.address ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet to see the registration hook in action
              </p>
              <WalletConnect/>
            </div>
          </div>
        ) : (
          <>
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">🔗 Connected Account</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-mono text-sm text-gray-700">
                  {account.address}
                </p>
              </div>
            </div>

            {/* Registration Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Current Status */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">📊 Registration Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Registered:</span>
                    <Badge className={registration.isRegistered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {registration.isRegistered ? '✅ Yes' : '❌ No'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">User Type:</span>
                    <Badge className={getUserTypeLabel(registration.userRole).color}>
                      {getUserTypeLabel(registration.userRole).icon} {getUserTypeLabel(registration.userRole).label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Loading:</span>
                    <Badge className={registration.loading ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                      {registration.loading ? '🔄 Loading' : '✅ Ready'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Current Step */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">🎯 Current Step</h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600 block mb-2">Registration Step:</span>
                    <Badge className={getStepColor(registration.currentStep)}>
                      {registration.currentStep}
                    </Badge>
                  </div>
                  
                  {registration.error && (
                    <div>
                      <span className="text-gray-600 block mb-2">Error:</span>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm">{registration.error}</p>
                      </div>
                    </div>
                  )}
                  
                  {registration.txHash && (
                    <div>
                      <span className="text-gray-600 block mb-2">Transaction Hash:</span>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-mono text-xs text-gray-700 break-all">
                          {registration.txHash}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Record Details */}
            {registration.userRecord && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">📋 User Record</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 block text-sm">User Type:</span>
                      <p className="font-medium">{getUserTypeLabel(registration.userRecord.userType).label}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-sm">Wallet Address:</span>
                      <p className="font-mono text-sm">{registration.userRecord.walletAddress}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-sm">Registration Time:</span>
                      <p className="font-medium">
                        {registration.userRecord.registrationTime ? 
                          new Date(Number(registration.userRecord.registrationTime) * 1000).toLocaleString() : 
                          'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-sm">Active:</span>
                      <Badge className={registration.userRecord.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {registration.userRecord.isActive ? '✅ Active' : '❌ Inactive'}
                      </Badge>
                    </div>
                    {registration.userRecord.emailHash && (
                      <div className="md:col-span-2">
                        <span className="text-gray-600 block text-sm">Email Hash:</span>
                        <p className="font-mono text-xs break-all">{registration.userRecord.emailHash}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Organization Registration Data */}
            {(registration.organizationType || registration.organizationName || registration.uniqueEmail) && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">🏢 Organization Registration Data</h2>
                <div className="space-y-4">
                  {registration.organizationType && (
                    <div>
                      <span className="text-gray-600 block mb-1">Organization Type:</span>
                      <Badge className={registration.organizationType === 'HOSPITAL' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}>
                        {registration.organizationType === 'HOSPITAL' ? '🏥 Hospital' : '🛡️ Insurance Company'}
                      </Badge>
                    </div>
                  )}
                  
                  {registration.organizationName && (
                    <div>
                      <span className="text-gray-600 block mb-1">Organization Name:</span>
                      <p className="font-medium">{registration.organizationName}</p>
                    </div>
                  )}
                  
                  {registration.uniqueEmail && (
                    <div>
                      <span className="text-gray-600 block mb-1">Verification Email:</span>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-mono text-sm">{registration.uniqueEmail}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hook Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">🎮 Available Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  onClick={() => registration.checkUserRole()}
                  disabled={registration.loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  🔍 Check User Role
                </Button>
                
                <Button 
                  onClick={() => registration.generateUniqueEmail()}
                  disabled={registration.loading}
                  variant="outline"
                >
                  📧 Generate Email
                </Button>
                
                <Button 
                  onClick={() => registration.reset()}
                  disabled={registration.loading}
                  variant="outline"
                >
                  🔄 Reset State
                </Button>
              </div>
            </div>

            {/* Raw Hook State */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">🔧 Raw Hook State (Debug)</h2>
              <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
                <pre className="text-green-400 text-sm">
                  {JSON.stringify({
                    currentStep: registration.currentStep,
                    userRole: registration.userRole,
                    isRegistered: registration.isRegistered,
                    loading: registration.loading,
                    txLoading: registration.txLoading,
                    error: registration.error,
                    txHash: registration.txHash,
                    organizationType: registration.organizationType,
                    organizationName: registration.organizationName,
                    uniqueEmail: registration.uniqueEmail,
                    patientEmail: registration.patientEmail,
                    walletAddress: registration.walletAddress
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 