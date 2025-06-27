import { Suspense } from 'react';
import RoleSelection from '@/components/register/role-selection';

export default async function RoleSelectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    }>
      <RoleSelection />
    </Suspense>
  );
} 