'use client';

import { useState, useEffect } from 'react';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { client } from '@/components/providers/thirdweb-providers';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/actions/healthcare-registration';
import { RegistrationFlow } from '@/components/registration/RegistrationFlow';

export function Header() {
  const account = useActiveAccount();
  const registration = useHealthcareRegistration();
  const [showRegistrationFlow, setShowRegistrationFlow] = useState(false);

  // Check user role when wallet connects
  useEffect(() => {
    if (account?.address && !registration.loading) {
      registration.checkUserRole();
    }
  }, [account?.address]);

  // Show registration flow if user is connected but not registered
  useEffect(() => {
    if (account?.address && !registration.isRegistered && !registration.loading && !showRegistrationFlow) {
      setShowRegistrationFlow(true);
    }
  }, [account?.address, registration.isRegistered, registration.loading]);

  const handleRegistrationComplete = (userRole: UserType) => {
    setShowRegistrationFlow(false);
    // You could show a success message or update UI state here
  };

  const getUserRoleDisplay = () => {
    if (!registration.userRole) return null;
    
    const roleNames = {
      [UserType.PATIENT]: 'Patient',
      [UserType.HOSPITAL]: 'Hospital',
      [UserType.INSURER]: 'Insurance Company'
    };
    
    return roleNames[registration.userRole];
  };

  const getUserDisplayName = () => {
    if (!registration.userRecord) return null;
    
    if (registration.userRole === UserType.PATIENT) {
      return `${account?.address?.slice(0, 6)}...${account?.address?.slice(-4)}`;
    } else {
      return registration.userRecord.organizationName || registration.userRecord.domain;
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">
                zkMed
              </div>
            </div>

            {/* Navigation (you can expand this) */}
            <nav className="hidden md:flex space-x-8">
              <a 
                href="/" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </a>
              {registration.isRegistered && (
                <>
                  {registration.userRole === UserType.PATIENT && (
                    <a 
                      href="/patient" 
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Records
                    </a>
                  )}
                  {(registration.userRole === UserType.HOSPITAL || registration.userRole === UserType.INSURER) && (
                    <a 
                      href="/organization" 
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </a>
                  )}
                </>
              )}
            </nav>

            {/* Right side - Wallet connection and user info */}
            <div className="flex items-center space-x-4">
              {/* User role badge */}
              {registration.isRegistered && getUserRoleDisplay() && (
                <div className="hidden md:flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    registration.userRole === UserType.PATIENT 
                      ? 'bg-blue-100 text-blue-800'
                      : registration.userRole === UserType.HOSPITAL
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {getUserRoleDisplay()}
                  </span>
                  {getUserDisplayName() && (
                    <span className="text-sm text-gray-600">
                      {getUserDisplayName()}
                    </span>
                  )}
                </div>
              )}

              {/* Connect wallet button */}
              <ConnectButton 
                client={client}
                theme="light"
                connectModal={{
                  size: "compact",
                  title: "Connect to zkMed",
                  titleIcon: "https://via.placeholder.com/32x32.png?text=🏥"
                }}
              />
            </div>
          </div>
        </div>

        {/* Loading indicator when checking registration */}
        {account?.address && registration.loading && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-blue-700">Checking registration status...</span>
            </div>
          </div>
        )}
      </header>

      {/* Registration Flow */}
      <RegistrationFlow
        isOpen={showRegistrationFlow}
        onClose={() => setShowRegistrationFlow(false)}
        onRegistrationComplete={handleRegistrationComplete}
      />
    </>
  );
} 