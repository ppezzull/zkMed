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

  // Registration checks are now handled by middleware, keeping minimal client-side check for immediate feedback
  // The middleware will automatically redirect registered users away from registration pages

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