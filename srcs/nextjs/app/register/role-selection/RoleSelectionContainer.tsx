import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';
import { useEffect } from 'react';
import { RoleSelectionPresentational } from './RoleSelectionPresentational';

export const RoleSelectionContainer = () => {
  const router = useRouter();
  const account = useActiveAccount();

  // Redirect if user is not connected
  useEffect(() => {
    if (!account?.address) {
      router.push('/');
    }
  }, [account?.address, router]);

  const handleRoleSelection = (role: 'PATIENT' | 'HOSPITAL' | 'INSURER') => {
    if (role === 'PATIENT') {
      router.push('/register/patient-email');
    } else {
      // Set organization type in localStorage temporarily
      localStorage.setItem('selectedOrganizationType', role);
      router.push('/register/organization-details');
    }
  };

  // Don't render if user is not connected
  if (!account?.address) {
    return null;
  }

  return (
    <RoleSelectionPresentational 
      onRoleSelect={handleRoleSelection}
      onBack={() => router.push('/')}
    />
  );
}; 