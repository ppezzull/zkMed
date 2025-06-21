import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/types/healthcare';
import { OrganizationDetailsPresentational } from './OrganizationDetailsPresentational';

export const OrganizationDetailsContainer = () => {
  const router = useRouter();
  const registration = useHealthcareRegistration();
  const account = useActiveAccount();
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState<'HOSPITAL' | 'INSURER' | null>(null);

  // Get organization type from localStorage
  useEffect(() => {
    const savedType = localStorage.getItem('selectedOrganizationType') as 'HOSPITAL' | 'INSURER' | null;
    if (savedType) {
      setOrganizationType(savedType);
      registration.setOrganizationType(savedType);
    }
  }, [registration]);

  // Redirect if user is already registered
  useEffect(() => {
    if (registration.isRegistered && registration.userRole !== null) {
      if (registration.userRole === UserType.PATIENT) {
        router.push(`/patient/${account?.address}`);
      } else if (registration.userRole === UserType.HOSPITAL) {
        router.push(`/hospital/${account?.address}`);
      } else if (registration.userRole === UserType.INSURER) {
        router.push(`/insurance/${account?.address}`);
      }
    }
  }, [registration.isRegistered, registration.userRole, account?.address, router]);

  // Redirect if user is not connected
  useEffect(() => {
    if (!account?.address) {
      router.push('/');
    }
  }, [account?.address, router]);

  const handleSubmit = (name: string) => {
    setOrganizationName(name);
    registration.setOrganizationName(name);
    registration.generateUniqueEmail();
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
      organizationType={organizationType || registration.organizationType}
      onSubmit={handleSubmit}
      onBack={handleBack}
    />
  );
}; 