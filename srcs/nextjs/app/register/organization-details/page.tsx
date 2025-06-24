import { Suspense } from 'react';
import { OrganizationDetailsContainer } from './OrganizationDetailsContainer';

export default async function OrganizationDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    }>
      <OrganizationDetailsContainer />
    </Suspense>
  );
} 