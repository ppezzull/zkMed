'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import { useHospital } from '@/hooks/useHospital';
import { useInsurance } from '@/hooks/useInsurance';
import { UserType } from '@/utils/types/healthcare';
import { CollectEmailPresentational } from './CollectEmailPresentational';

export const CollectEmailContainer = () => {
  const router = useRouter();
  const account = useActiveAccount();
  const [organizationType, setOrganizationType] = useState<'HOSPITAL' | 'INSURER' | null>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  
  // Use appropriate hook based on organization type
  const hospital = useHospital();
  const insurance = useInsurance();
  
  const registration = organizationType === 'HOSPITAL' ? hospital : insurance;

  // Get organization type and name from localStorage
  useEffect(() => {
    const savedType = localStorage.getItem('selectedOrganizationType') as 'HOSPITAL' | 'INSURER' | null;
    const savedName = localStorage.getItem('organizationName') || '';
    if (savedType) {
      setOrganizationType(savedType);
    }
    setOrganizationName(savedName);
  }, []);

  // Check if user is already registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (account?.address) {
        try {
          const verification = await registration.fetchUserVerification(account.address);
          if (verification?.isRegistered) {
            // Redirect based on user type
            if (verification.userType === UserType.HOSPITAL) {
              router.push(`/hospital/${account.address}`);
            } else if (verification.userType === UserType.INSURER) {
              router.push(`/insurance/${account.address}`);
            } else if (verification.userType === UserType.PATIENT) {
              router.push(`/patient/${account.address}`);
            }
          }
        } catch (error) {
          console.error('Error checking registration:', error);
        }
      }
    };

    if (registration) {
      checkRegistration();
    }
  }, [account?.address, registration, router]);

  // Redirect if user is not connected
  useEffect(() => {
    if (!account?.address) {
      router.push('/');
    }
  }, [account?.address, router]);

  // Handle registration success
  useEffect(() => {
    if (registration.registrationStep === 'Registration completed successfully!') {
      setIsRegistrationComplete(true);
      setTimeout(() => {
        if (organizationType === 'HOSPITAL') {
          router.push(`/hospital/${account?.address}`);
        } else if (organizationType === 'INSURER') {
          router.push(`/insurance/${account?.address}`);
        }
      }, 2000);
    }
  }, [registration.registrationStep, organizationType, account?.address, router]);

  const handleEmailSubmit = async (emlContent: string) => {
    if (!account?.address || !organizationName) return;
    
    if (organizationType === 'HOSPITAL') {
      await hospital.registerHospital(emlContent, organizationName, account.address);
    } else if (organizationType === 'INSURER') {
      await insurance.registerInsurer(emlContent, organizationName, account.address);
    }
  };

  const handleBack = () => {
    router.push('/register/send-email');
  };

  // Don't render if user is not connected
  if (!account?.address) {
    return null;
  }

  // Show loading/success state
  if (registration.isRegistering || isRegistrationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          {isRegistrationComplete ? (
            <>
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Success!</h2>
              <p className="text-gray-600 mb-4">
                Your organization registration has been submitted for admin approval.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you to your dashboard...
              </p>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">{registration.registrationStep || 'Processing registration...'}</h2>
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
    <CollectEmailPresentational 
      onSubmit={handleEmailSubmit}
      onBack={handleBack}
      error={registration.error}
      loading={registration.isLoading}
    />
  );
}; 