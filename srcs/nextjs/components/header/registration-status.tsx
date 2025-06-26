'use client';

import { useActiveAccount } from 'thirdweb/react';
import { useRegistrationStatus } from '@/hooks/useRegistrationStatus';
import { UserType } from '@/utils/types/healthcare';
import { getUserDashboardPath } from '@/utils/thirdweb/middleware';

interface RegistrationStatusProps {
  loading: boolean;
}

export default function RegistrationStatus({ loading }: RegistrationStatusProps) {
  const account = useActiveAccount();
  const registrationStatus = useRegistrationStatus();

  if (!account?.address) {
    return null;
  }

  if (loading || registrationStatus.isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (registrationStatus.isRegistered && registrationStatus.userType !== null) {
    const dashboardPath = getUserDashboardPath(
      registrationStatus.userType, 
      registrationStatus.verificationData?.isAdmin || false, 
      account.address
    );

    const roleDisplay = registrationStatus.userType === UserType.PATIENT ? 'Patient' :
                       registrationStatus.userType === UserType.HOSPITAL ? 'Hospital' :
                       registrationStatus.userType === UserType.INSURER ? 'Insurance' :
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
