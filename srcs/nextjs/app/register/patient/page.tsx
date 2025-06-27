'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import SendEmail from '@/components/register/send-email';
import CollectEmail from '@/components/register/collect-email';
import VerifyRegistration from '@/components/register/verify-registration';

type PatientStep = 'send' | 'collect' | 'verify';

export default function PatientPage() {
  const router = useRouter();
  const account = useActiveAccount();
  const [step, setStep] = useState<PatientStep>('send');
  const [emailId, setEmailId] = useState<string>('');
  const [emlContent, setEmlContent] = useState<string>('');

  // Redirect if user is not connected
  useEffect(() => {
    if (!account?.address) {
      router.push('/');
    }
  }, [account?.address, router]);

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
      case 'send':
        router.push('/register/role-selection');
        break;
      case 'collect':
        setStep('send');
        break;
      case 'verify':
        setStep('collect');
        break;
    }
  };

  // Don't render if user is not connected
  if (!account?.address) {
    return null;
  }

  return (
    <>
      {step === 'send' && (
        <SendEmail
          role="PATIENT"
          onEmailSent={handleEmailSent}
          onBack={handleBack}
        />
      )}
      
      {step === 'collect' && (
        <CollectEmail
          emailId={emailId}
          role="PATIENT"
          onEmailReceived={handleEmailReceived}
          onBack={handleBack}
        />
      )}
      
      {step === 'verify' && (
        <VerifyRegistration
          role="PATIENT"
          emlContent={emlContent}
          onBack={handleBack}
        />
      )}
    </>
  );
} 