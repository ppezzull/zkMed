'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import OrganizationDetails from '@/components/register/organization-details';
import SendEmail from '@/components/register/send-email';
import CollectEmail from '@/components/register/collect-email';
import VerifyRegistration from '@/components/register/verify-registration';

type OrganizationType = 'HOSPITAL' | 'INSURER';
type OrganizationStep = 'details' | 'send' | 'collect' | 'verify';

export default function OrganizationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const account = useActiveAccount();
  
  const [organizationType, setOrganizationType] = useState<OrganizationType | null>(null);
  const [step, setStep] = useState<OrganizationStep>('details');
  const [organizationName, setOrganizationName] = useState<string>('');
  const [emailId, setEmailId] = useState<string>('');
  const [emlContent, setEmlContent] = useState<string>('');

  // Get organization type from URL params
  useEffect(() => {
    const type = searchParams.get('type') as OrganizationType;
    if (type === 'HOSPITAL' || type === 'INSURER') {
      setOrganizationType(type);
    } else {
      router.push('/register/role-selection');
    }
  }, [searchParams, router]);

  // Redirect if user is not connected
  useEffect(() => {
    if (!account?.address) {
      router.push('/');
    }
  }, [account?.address, router]);

  const handleDetailsSubmit = (name: string) => {
    setOrganizationName(name);
    setStep('send');
  };

  const handleEmailSent = (id: string) => {
    setEmailId(id);
    setStep('collect');
  };

  const handleEmailReceived = (content: string) => {
    setEmlContent(content);
    setStep('verify');
  };

  const handleBack = () => {
    switch (step) {
      case 'details':
        router.push('/register/role-selection');
        break;
      case 'send':
        setStep('details');
        break;
      case 'collect':
        setStep('send');
        break;
      case 'verify':
        setStep('collect');
        break;
    }
  };

  // Don't render if user is not connected or organization type is not set
  if (!account?.address || !organizationType) {
    return null;
  }

  return (
    <>
      {step === 'details' && (
        <OrganizationDetails
          organizationType={organizationType}
          organizationName={organizationName}
          setOrganizationName={setOrganizationName}
          onSubmit={handleDetailsSubmit}
          onBack={handleBack}
        />
      )}
      
      {step === 'send' && (
        <SendEmail
          role={organizationType}
          organizationName={organizationName}
          onEmailSent={handleEmailSent}
          onBack={handleBack}
        />
      )}
      
      {step === 'collect' && (
        <CollectEmail
          emailId={emailId}
          role={organizationType}
          onEmailReceived={handleEmailReceived}
          onBack={handleBack}
        />
      )}
      
      {step === 'verify' && (
        <VerifyRegistration
          role={organizationType}
          emlContent={emlContent}
          organizationName={organizationName}
          onBack={handleBack}
        />
      )}
    </>
  );
} 