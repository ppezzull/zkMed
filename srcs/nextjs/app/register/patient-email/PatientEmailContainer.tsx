'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import { usePatient } from '@/hooks/usePatient';
import { PatientEmailPresentational } from './PatientEmailPresentational';

export const PatientEmailContainer = () => {
  const router = useRouter();
  const patient = usePatient();
  const account = useActiveAccount();
  const [email, setEmail] = useState('');
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

  // Use centralized registration status
  const { registrationStatus } = patient;

  // Redirect if user is already registered (handled by middleware now, but keep for immediate feedback)
  useEffect(() => {
    if (registrationStatus.isRegistered && account?.address) {
      registrationStatus.redirectToDashboard();
    }
  }, [registrationStatus.isRegistered, account?.address, registrationStatus]);

  // Redirect if user is not connected
  useEffect(() => {
    if (!account?.address) {
      router.push('/');
    }
  }, [account?.address, router]);

  // Handle registration success
  useEffect(() => {
    if (patient.registrationStep === 'Registration completed successfully!') {
      setIsRegistrationComplete(true);
      setTimeout(() => {
        router.push(`/patient/${account?.address}`);
      }, 2000);
    }
  }, [patient.registrationStep, account?.address, router]);

  const handleEmailSubmit = async (emailValue: string) => {
    if (!account?.address) return;
    
    setEmail(emailValue);
    await patient.registerPatient(emailValue, account.address);
  };

  const handleBack = () => {
    router.push('/register/role-selection');
  };

  // Don't render if user is not connected
  if (!account?.address) {
    return null;
  }

  // Show loading/success state
  if (patient.isRegistering || isRegistrationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          {isRegistrationComplete ? (
            <>
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Success!</h2>
              <p className="text-gray-600 mb-4">
                Your patient registration has been completed successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you to your dashboard...
              </p>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">{patient.registrationStep || 'Processing registration...'}</h2>
              <p className="text-gray-600 text-sm">
                Please wait while we process your registration...
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <PatientEmailPresentational 
      email={email}
      setEmail={setEmail}
      onSubmit={handleEmailSubmit}
      onBack={handleBack}
      isLoading={patient.isLoading}
      error={patient.error}
    />
  );
}; 