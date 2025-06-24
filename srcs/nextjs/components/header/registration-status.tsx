'use client';

import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { usePatient } from '@/hooks/usePatient';
import { useHospital } from '@/hooks/useHospital';
import { useInsurance } from '@/hooks/useInsurance';
import { UserType } from '@/utils/types/healthcare';

interface RegistrationStatusProps {
  loading: boolean;
}

export default function RegistrationStatus({ loading }: RegistrationStatusProps) {
  const account = useActiveAccount();
  const [currentUserType, setCurrentUserType] = useState<UserType | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  
  // Use all specialized hooks
  const patient = usePatient();
  const hospital = useHospital();
  const insurance = useInsurance();

  // Check user registration status
  useEffect(() => {
    const checkRegistration = async () => {
      if (!account?.address) return;
      
      setCheckingRegistration(true);
      try {
        // Try patient first
        const patientVerification = await patient.fetchUserVerification(account.address);
        if (patientVerification?.isRegistered) {
          setCurrentUserType(patientVerification.userType);
          setIsRegistered(true);
          return;
        }

        // Try hospital
        const hospitalVerification = await hospital.fetchUserVerification(account.address);
        if (hospitalVerification?.isRegistered) {
          setCurrentUserType(hospitalVerification.userType);
          setIsRegistered(true);
          return;
        }

        // Try insurance
        const insuranceVerification = await insurance.fetchUserVerification(account.address);
        if (insuranceVerification?.isRegistered) {
          setCurrentUserType(insuranceVerification.userType);
          setIsRegistered(true);
          return;
        }

        // Not registered
        setIsRegistered(false);
        setCurrentUserType(null);
      } catch (error) {
        console.error('Error checking registration:', error);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [account?.address, patient, hospital, insurance]);

  if (!account?.address) {
    return null;
  }

  if (loading || checkingRegistration || patient.isLoading || hospital.isLoading || insurance.isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (isRegistered && currentUserType !== null) {
    const dashboardPath = currentUserType === UserType.PATIENT ? `/patient/${account.address}` :
                         currentUserType === UserType.HOSPITAL ? `/hospital/${account.address}` :
                         currentUserType === UserType.INSURER ? `/insurance/${account.address}` :
                         '/register';

    const roleDisplay = currentUserType === UserType.PATIENT ? 'Patient' :
                       currentUserType === UserType.HOSPITAL ? 'Hospital' :
                       currentUserType === UserType.INSURER ? 'Insurance' :
                       'Unknown';

    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600 font-medium">
            Registered as {roleDisplay}
          </span>
        </div>
        <a 
          href={dashboardPath}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
        <span className="text-sm text-yellow-600 font-medium">Not Registered</span>
      </div>
      <a 
        href="/register"
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Register
      </a>
    </div>
  );
}
