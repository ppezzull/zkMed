'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { usePatient } from '@/hooks/usePatient';
import { useHospital } from '@/hooks/useHospital';
import { useInsurance } from '@/hooks/useInsurance';
import { useFunding } from '@/hooks/useFunding';
import { useActiveAccount } from 'thirdweb/react';
import { UserType } from '@/utils/types/healthcare';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import WalletConnect from '@/components/wallet-connect';
import { formatEther } from 'viem';

export default function DemoClient() {
  const account = useActiveAccount();
  const [currentUserType, setCurrentUserType] = useState<UserType | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  
  // Use all specialized hooks
  const admin = useAdmin();
  const patient = usePatient();
  const hospital = useHospital();
  const insurance = useInsurance();
  const funding = useFunding();

  // Check user registration status
  useEffect(() => {
    const checkRegistration = async () => {
      if (!account?.address) return;
      
      setCheckingRegistration(true);
      try {
        // Try patient first
        const patientVerification = await patient.fetchUserVerification(account.address);
        if (patientVerification?.isRegistered) {
          setCurrentUserType(patientVerification.userType);
          setIsRegistered(true);
          return;
        }

        // Try hospital
        const hospitalVerification = await hospital.fetchUserVerification(account.address);
        if (hospitalVerification?.isRegistered) {
          setCurrentUserType(hospitalVerification.userType);
          setIsRegistered(true);
          return;
        }

        // Try insurance
        const insuranceVerification = await insurance.fetchUserVerification(account.address);
        if (insuranceVerification?.isRegistered) {
          setCurrentUserType(insuranceVerification.userType);
          setIsRegistered(true);
          return;
        }

        // Not registered
        setIsRegistered(false);
        setCurrentUserType(null);
      } catch (error) {
        console.error('Error checking registration:', error);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [account?.address, patient, hospital, insurance]);

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

  const getCurrentStep = () => {
    if (patient.registrationStep === 'Registration completed successfully!' ||
        hospital.registrationStep === 'Registration completed successfully!' ||
        insurance.registrationStep === 'Registration completed successfully!') {
      return 'Registration successful!';
    }
    
    if (patient.error || hospital.error || insurance.error) {
      return `Error: ${patient.error || hospital.error || insurance.error}`;
    }
    
    if (patient.isRegistering || hospital.isRegistering || insurance.isRegistering) {
      return 'Processing...';
    }
    
    if (isRegistered) {
      return 'Already registered';
    }
    
    return 'Ready to register';
  };

  const getStepColor = () => {
    const step = getCurrentStep();
    if (step.includes('successful') || step.includes('Already registered')) {
      return 'bg-green-100 text-green-800';
    }
    if (step.includes('Error')) {
      return 'bg-red-100 text-red-800';
    }
    if (step.includes('Processing')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const handleFundWallet = async (amount: string) => {
    try {
      await funding.fundWallet(amount);
    } catch (error) {
      console.error('Funding failed:', error);
    }
  };

  const isAnyHookLoading = patient.isLoading || hospital.isLoading || insurance.isLoading || admin.loading;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 zkMed Registration Hooks Demo
          </h1>
          <p className="text-gray-600">
            Live demonstration of specialized healthcare registration hooks and wallet funding
          </p>
        </div>

        {/* Wallet Connection */}
        {!account?.address ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet to see the registration hooks in action
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

            {/* Wallet Balance & Funding */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">💰 Wallet Balance & Funding</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Balance:</span>
                  <Badge className={funding.balance > BigInt(0) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {funding.isLoading ? '🔄 Loading...' : `${formatEther(funding.balance)} ETH`}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={funding.isReady ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {funding.isReady ? '✅ Ready' : '🔄 Loading'}
                  </Badge>
                </div>

                {funding.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{funding.error}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleFundWallet('1')}
                    disabled={funding.isFunding}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {funding.isFunding ? '🔄 Funding...' : '💳 Fund 1 ETH'}
                  </Button>
                  <Button 
                    onClick={() => handleFundWallet('0.1')}
                    disabled={funding.isFunding}
                    variant="outline"
                  >
                    {funding.isFunding ? '🔄 Funding...' : '💳 Fund 0.1 ETH'}
                  </Button>
                  <Button 
                    onClick={funding.refreshBalance}
                    disabled={funding.isLoading}
                    variant="outline"
                  >
                    🔄 Refresh
                  </Button>
                </div>
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
                    <Badge className={isRegistered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {checkingRegistration ? '🔄 Checking...' : (isRegistered ? '✅ Yes' : '❌ No')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">User Type:</span>
                    <Badge className={getUserTypeLabel(currentUserType).color}>
                      {getUserTypeLabel(currentUserType).icon} {getUserTypeLabel(currentUserType).label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Loading:</span>
                    <Badge className={isAnyHookLoading ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                      {isAnyHookLoading ? '🔄 Loading' : '✅ Ready'}
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
                    <Badge className={getStepColor()}>
                      {getCurrentStep()}
                    </Badge>
                  </div>
                  
                  {(patient.error || hospital.error || insurance.error) && (
                    <div>
                      <span className="text-gray-600 block mb-2">Error:</span>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm">{patient.error || hospital.error || insurance.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hook States Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">🔧 Hooks State Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">👤 Patient Hook</h3>
                  <div className="space-y-1 text-xs">
                    <div>Loading: {patient.isLoading ? '🔄' : '✅'}</div>
                    <div>Registering: {patient.isRegistering ? '🔄' : '❌'}</div>
                    <div>Error: {patient.error ? '❌' : '✅'}</div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">🏥 Hospital Hook</h3>
                  <div className="space-y-1 text-xs">
                    <div>Loading: {hospital.isLoading ? '🔄' : '✅'}</div>
                    <div>Registering: {hospital.isRegistering ? '🔄' : '❌'}</div>
                    <div>Error: {hospital.error ? '❌' : '✅'}</div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">🛡️ Insurance Hook</h3>
                  <div className="space-y-1 text-xs">
                    <div>Loading: {insurance.isLoading ? '🔄' : '✅'}</div>
                    <div>Registering: {insurance.isRegistering ? '🔄' : '❌'}</div>
                    <div>Error: {insurance.error ? '❌' : '✅'}</div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">⚖️ Admin Hook</h3>
                  <div className="space-y-1 text-xs">
                    <div>Is Admin: {admin.isAdmin ? '✅' : '❌'}</div>
                    <div>Loading: {admin.loading ? '🔄' : '✅'}</div>
                    <div>Requests: {admin.pendingRequests?.length || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => window.location.href = '/register'}
                  disabled={isRegistered}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  🔗 Go to Registration
                </Button>
                
                {currentUserType === UserType.PATIENT && (
                  <Button 
                    onClick={() => window.location.href = `/patient/${account.address}`}
                    variant="outline"
                  >
                    👤 Patient Dashboard
                  </Button>
                )}
                
                {currentUserType === UserType.HOSPITAL && (
                  <Button 
                    onClick={() => window.location.href = `/hospital/${account.address}`}
                    variant="outline"
                  >
                    🏥 Hospital Dashboard
                  </Button>
                )}
                
                {currentUserType === UserType.INSURER && (
                  <Button 
                    onClick={() => window.location.href = `/insurance/${account.address}`}
                    variant="outline"
                  >
                    🛡️ Insurance Dashboard
                  </Button>
                )}
                
                {admin.isAdmin && (
                  <Button 
                    onClick={() => window.location.href = '/admin'}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    ⚖️ Admin Dashboard
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 