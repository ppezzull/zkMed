'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import { useHospital } from '@/hooks/useHospital';
import { useInsurance } from '@/hooks/useInsurance';
import { UserType } from '@/utils/types/healthcare';
import { OrganizationDetailsPresentational } from './OrganizationDetailsPresentational';

export const OrganizationDetailsContainer = () => {
  const router = useRouter();
  const account = useActiveAccount();
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState<'HOSPITAL' | 'INSURER' | null>(null);

  // Use appropriate hook based on organization type
  const hospital = useHospital();
  const insurance = useInsurance();
  
  const registration = organizationType === 'HOSPITAL' ? hospital : insurance;

  // Get organization type from localStorage
  useEffect(() => {
    const savedType = localStorage.getItem('selectedOrganizationType') as 'HOSPITAL' | 'INSURER' | null;
    if (savedType) {
      setOrganizationType(savedType);
    }
  }, []);

  // Check if user is already registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (account?.address && registration) {
        try {
          const verification = await registration.fetchUserVerification(account.address);
          if (verification?.isRegistered) {
            // Redirect based on user type
            if (verification.userType === UserType.PATIENT) {
              router.push(`/patient/${account.address}`);
            } else if (verification.userType === UserType.HOSPITAL) {
              router.push(`/hospital/${account.address}`);
            } else if (verification.userType === UserType.INSURER) {
              router.push(`/insurance/${account.address}`);
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

  const handleSubmit = (name: string) => {
    setOrganizationName(name);
    // Save organization name to localStorage for use in later steps
    localStorage.setItem('organizationName', name);
    router.push('/register/send-email');
  };

  const handleBack = () => {
    router.push('/register/role-selection');
  };

  // Don't render if user is not connected
  if (!account?.address) {
    return null;
  }

  return (
    <OrganizationDetailsPresentational 
      organizationName={organizationName}
      setOrganizationName={setOrganizationName}
      organizationType={organizationType}
      onSubmit={handleSubmit}
      onBack={handleBack}
    />
  );
}; 