import { Suspense } from 'react';
import { getOrganizationRecord, getUserVerificationData } from '@/lib/actions/healthcare';
import HospitalDashboard from '@/components/hospital/hospital-dashboard';

interface HospitalPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default async function HospitalPage({ params }: HospitalPageProps) {
  const { address } = await params;
  
  try {
    // Fetch initial data server-side
    const [organizationRecord, verificationData] = await Promise.allSettled([
      getOrganizationRecord(address),
      getUserVerificationData(address)
    ]);

    const initialOrganizationRecord = organizationRecord.status === 'fulfilled' ? organizationRecord.value : null;
    const initialVerificationData = verificationData.status === 'fulfilled' ? verificationData.value : null;

    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      }>
        <HospitalDashboard 
          address={address}
          initialOrganizationRecord={initialOrganizationRecord}
          initialVerificationData={initialVerificationData}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading hospital page:', error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load hospital dashboard</p>
          <p className="text-sm text-gray-500 mt-2">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }
} 