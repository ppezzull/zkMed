'use client';

import { useActiveAccount } from 'thirdweb/react';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';

interface RegistrationStatusProps {
  loading: boolean;
}

export default function RegistrationStatus({ loading }: RegistrationStatusProps) {
  const account = useActiveAccount();

  if (!account?.address || !loading) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
        <span className="text-sm text-blue-700">Checking registration status...</span>
      </div>
    </div>
  );
}
