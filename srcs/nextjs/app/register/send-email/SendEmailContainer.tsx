import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/types/healthcare';
import { SendEmailPresentational } from './SendEmailPresentational';

export const SendEmailContainer = () => {
  const router = useRouter();
  const registration = useHealthcareRegistration();
  const account = useActiveAccount();

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

  const getEmailSubject = () => {
    if (!registration.organizationType || !registration.organizationName || !account?.address) return '';
    return `Register organization ${registration.organizationName} as ${registration.organizationType} with wallet: ${account.address}`;
  };

  return (
    <SendEmailPresentational 
      uniqueEmail={registration.uniqueEmail}
      subject={getEmailSubject()}
      organizationName={registration.organizationName}
      organizationType={registration.organizationType}
      onEmailSent={handleEmailSent}
      onBack={handleBack}
    />
  );
}; 