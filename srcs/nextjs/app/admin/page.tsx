import { Suspense } from 'react';
import { 
  mockGetPendingRequests, 
  mockGetPendingRequestsByType, 
  mockGetRegistrationStats 
} from '@/lib/mock-data';
import { RequestType } from '@/utils/types/healthcare';
import AdminDashboard from '@/components/admin/admin-dashboard';

interface AdminPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedParams = await searchParams;
  
  // Extract URL parameters with defaults
  const currentFilter = (resolvedParams.filter as string) || 'all';
  const currentSort = (resolvedParams.sort as string) || 'newest';

  try {
    // Fetch initial data on the server
    const [
      allPendingRequests,
      patientRequests,
      organizationRequests,
      adminRequests,
      registrationStats
    ] = await Promise.all([
      mockGetPendingRequests(),
      mockGetPendingRequestsByType(RequestType.PATIENT_REGISTRATION),
      mockGetPendingRequestsByType(RequestType.ORG_REGISTRATION),
      mockGetPendingRequestsByType(RequestType.ADMIN_ACCESS),
      mockGetRegistrationStats()
    ]);

    if (!registrationStats) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">Failed to load admin dashboard data</p>
          </div>
        </div>
      );
    }

    return (
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      }>
        <AdminDashboard
          initialData={{
            allPendingRequests: allPendingRequests || [],
            patientRequests: patientRequests || [],
            organizationRequests: organizationRequests || [],
            adminRequests: adminRequests || [],
            registrationStats,
            currentFilter,
            currentSort
          }}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading admin page:', error);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load admin dashboard</p>
          <p className="text-sm text-gray-500 mt-2">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }
} 