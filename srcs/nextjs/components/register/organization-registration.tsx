'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrganizationRegistration() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to role selection to choose organization type
      router.push('/register/role-selection');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
    </div>
  );
} 