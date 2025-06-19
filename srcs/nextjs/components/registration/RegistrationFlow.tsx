'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/types/healthcare';
import { RoleSelectionDialog } from './RoleSelectionDialog';
import { OrganizationNameDialog } from './OrganizationNameDialog';
import { SendEmailDialog } from './SendEmailDialog';
import { CollectEmailDialog } from './CollectEmailDialog';

interface RegistrationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: (userRole: UserType) => void;
}

export function RegistrationFlow({ 
  isOpen, 
  onClose, 
  onRegistrationComplete 
}: RegistrationFlowProps) {
  const router = useRouter();
  const registration = useHealthcareRegistration();
  const account = useActiveAccount();
  
  // Local dialog state
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showOrganizationName, setShowOrganizationName] = useState(false);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [showCollectEmail, setShowCollectEmail] = useState(false);

  // Only show dialogs when the flow is explicitly opened, user is connected, and user needs to register
  useEffect(() => {
    if (isOpen && account?.address) {
      // Only show role selection if user is confirmed to not be registered
      // and we're not still loading the registration status  
      if (!registration.loading && registration.isRegistered === false) {
        setShowRoleSelection(true);
      }
    } else {
      // If the flow is closed or user not connected, make sure all dialogs are closed
      setShowRoleSelection(false);
      setShowOrganizationName(false);
      setShowSendEmail(false);
      setShowCollectEmail(false);
    }
  }, [isOpen, account?.address, registration.isRegistered, registration.loading]);

  // Handle registration success
  useEffect(() => {
    if (registration.currentStep === "Registration successful!" && registration.userRole !== null) {
      // Close all dialogs
      closeAllDialogs();
      onRegistrationComplete(registration.userRole);
      
      // Redirect based on role
      setTimeout(() => {
        if (registration.userRole === UserType.PATIENT) {
          router.push('/patient');
        } else {
          router.push('/organization');
        }
      }, 1000);
    }
  }, [registration.currentStep, registration.userRole]);

  const closeAllDialogs = () => {
    setShowRoleSelection(false);
    setShowOrganizationName(false);
    setShowSendEmail(false);
    setShowCollectEmail(false);
  };

  const handleClose = () => {
    closeAllDialogs();
    registration.reset();
    onClose();
  };

  const handleRoleSelection = (role: 'PATIENT' | 'HOSPITAL' | 'INSURER') => {
    if (role === 'PATIENT') {
      // Register patient directly
      setShowRoleSelection(false);
      registration.registerPatient();
    } else {
      // Start organization registration flow
      registration.setOrganizationType(role);
      setShowRoleSelection(false);
      setShowOrganizationName(true);
    }
  };

  const handleOrganizationNameSubmit = (name: string) => {
    registration.setOrganizationName(name);
    registration.generateUniqueEmail();
    setShowOrganizationName(false);
    setShowSendEmail(true);
  };

  const handleEmailSent = () => {
    setShowSendEmail(false);
    setShowCollectEmail(true);
  };

  const handleEmailSubmit = (emlContent: string) => {
    registration.startOrganizationRegistration(emlContent);
    // Keep the collect email dialog open to show progress
  };

  // Error handling - don't show alerts for role checking errors (background checks)
  useEffect(() => {
    if (registration.error && registration.error !== 'Failed to check user role') {
      alert(`Registration Error: ${registration.error}`);
      registration.reset();
    }
  }, [registration.error]);

  return (
    <>
      {/* Role Selection Dialog */}
      <RoleSelectionDialog
        isOpen={showRoleSelection}
        onClose={handleClose}
        onSelectRole={handleRoleSelection}
        loading={registration.loading}
      />

      {/* Organization Name Dialog */}
      <OrganizationNameDialog
        isOpen={showOrganizationName}
        onClose={handleClose}
        onContinue={handleOrganizationNameSubmit}
        organizationType={registration.organizationType!}
        loading={registration.loading}
      />

      {/* Send Email Dialog */}
      <SendEmailDialog
        isOpen={showSendEmail}
        onClose={handleClose}
        onEmailSent={handleEmailSent}
        organizationType={registration.organizationType!}
        organizationName={registration.organizationName}
        walletAddress={registration.walletAddress}
        uniqueEmail={registration.uniqueEmail}
      />

      {/* Collect Email Dialog */}
      <CollectEmailDialog
        isOpen={showCollectEmail}
        onClose={handleClose}
        onSubmitEmail={handleEmailSubmit}
        organizationType={registration.organizationType!}
        loading={registration.loading}
        currentStep={registration.currentStep}
      />

      {/* Success/Loading Overlay */}
      {(registration.loading || registration.currentStep === "Registration successful!") && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            {registration.currentStep === "Registration successful!" ? (
              <>
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-green-800 mb-4">Success!</h2>
                <p className="text-gray-600 mb-4">
                  Your registration has been completed successfully.
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
      )}
    </>
  );
} 