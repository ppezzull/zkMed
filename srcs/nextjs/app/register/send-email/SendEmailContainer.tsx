'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import { useHospital } from '@/hooks/useHospital';
import { useInsurance } from '@/hooks/useInsurance';
import { UserType } from '@/utils/types/healthcare';
import { SendEmailPresentational } from './SendEmailPresentational';

export const SendEmailContainer = () => {
  const router = useRouter();
  const account = useActiveAccount();
  const [organizationType, setOrganizationType] = useState<'HOSPITAL' | 'INSURER' | null>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [uniqueEmail, setUniqueEmail] = useState('');
  const [subject, setSubject] = useState('');

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

  // Generate unique email address and subject when we have all the data
  useEffect(() => {
    if (organizationType && organizationName && account?.address) {
      // Generate a unique email address for registration
      const timestamp = Date.now();
      const email = `zkmed-${organizationType.toLowerCase()}-${timestamp}@temp-verify.zkmed.org`;
      setUniqueEmail(email);

      // Generate the subject line as expected by the smart contract
      const subjectLine = `Register organization ${organizationName} as ${organizationType} with wallet: ${account.address}`;
      setSubject(subjectLine);
    }
  }, [organizationType, organizationName, account?.address]);

  // Registration checks are now handled by middleware

  // Redirect if user is not connected
  useEffect(() => {
    if (!account?.address) {
      router.push('/');
    }
  }, [account?.address, router]);

  const handleEmailSent = () => {
    router.push('/register/collect-email');
  };

  const handleBack = () => {
    router.push('/register/organization-details');
  };

  // Don't render if user is not connected
  if (!account?.address) {
    return null;
  }

  return (
    <SendEmailPresentational 
      uniqueEmail={uniqueEmail}
      subject={subject}
      organizationName={organizationName}
      organizationType={organizationType}
      onEmailSent={handleEmailSent}
      onBack={handleBack}
    />
  );
}; 