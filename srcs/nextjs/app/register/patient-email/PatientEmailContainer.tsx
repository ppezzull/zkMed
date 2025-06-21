import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/types/healthcare';
import { PatientEmailPresentational } from './PatientEmailPresentational';

export const PatientEmailContainer = () => {
  const router = useRouter();
  const registration = useHealthcareRegistration();
  const account = useActiveAccount();
  const [email, setEmail] = useState('');

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

  // Handle registration success
  useEffect(() => {
    if (registration.currentStep === "Registration successful!" && registration.userRole !== null) {
      setTimeout(() => {
        if (registration.userRole === UserType.PATIENT) {
          router.push(`/patient/${account?.address}`);
        }
      }, 2000);
    }
  }, [registration.currentStep, registration.userRole, account?.address, router]);

  const handleEmailSubmit = (emailValue: string) => {
    setEmail(emailValue);
    registration.setPatientEmail(emailValue);
    registration.registerPatient(emailValue);
  };

  const handleBack = () => {
    router.push('/register/role-selection');
  };

  // Don't render if user is not connected
  if (!account?.address) {
    return null;
  }

  // Show loading/success state
  if (registration.loading || registration.currentStep === "Registration successful!") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          {registration.currentStep === "Registration successful!" ? (
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
              <h2 className="text-xl font-semibold mb-2">{registration.currentStep}</h2>
              <p className="text-gray-600 text-sm">
                Please wait while we process your registration...
              </p>
              {registration.txHash && (
                <p className="text-xs text-gray-500 mt-2">
                  Transaction: {registration.txHash.slice(0, 10)}...{registration.txHash.slice(-8)}
                </p>
              )}
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
      error={registration.error}
    />
  );
}; 