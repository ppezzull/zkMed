import { Suspense } from 'react';
import { mockGetPatientRecord, mockGetUserVerificationData } from '@/lib/mock-data';
import PatientDashboard from '@/components/patient/patient-dashboard';

interface PatientPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { address } = await params;
  
  try {
    // Fetch initial data server-side
    const [patientRecord, verificationData] = await Promise.allSettled([
      mockGetPatientRecord(address),
      mockGetUserVerificationData(address)
    ]);

    const initialPatientRecord = patientRecord.status === 'fulfilled' ? patientRecord.value : null;
    const initialVerificationData = verificationData.status === 'fulfilled' ? verificationData.value : null;

    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      }>
        <PatientDashboard 
          initialData={{
            patientRecord: initialPatientRecord,
            userVerification: initialVerificationData,
            walletAddress: address
          }}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading patient page:', error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load patient dashboard</p>
          <p className="text-sm text-gray-500 mt-2">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }
} 