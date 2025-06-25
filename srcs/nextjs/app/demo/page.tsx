import { Suspense } from 'react';
import DemoClient from '@/components/demo/demo-client';
import { getRegistrationStats } from '@/lib/actions/admin';
import { RegistrationStats } from '@/utils/types/healthcare';


function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Server-side data fetching
async function getDemoPageData(): Promise<{
  registrationStats: RegistrationStats;
  hasRpcError: boolean;
}> {
  try {
    console.log('🔍 Fetching demo page data...');
    await sleep(10000);
    // Fetch registration statistics for the demo
    const registrationStats = await getRegistrationStats();
    
    // Check if we got actual data or zero values (indicating RPC error)
    const hasRpcError = registrationStats.totalRegisteredUsers === BigInt(0) &&
                       registrationStats.totalPatients === BigInt(0) &&
                       registrationStats.totalHospitals === BigInt(0) &&
                       registrationStats.totalInsurers === BigInt(0);
    
    console.log('✅ Demo page data fetched:', { registrationStats, hasRpcError });
    
    return {
      registrationStats,
      hasRpcError
    };
  } catch (error) {
    console.error('❌ Error fetching demo page data:', error);
    return {
      registrationStats: {
        totalRegisteredUsers: BigInt(0),
        totalPatients: BigInt(0),
        totalHospitals: BigInt(0),
        totalInsurers: BigInt(0)
      },
      hasRpcError: true
    };
  }
}

export default async function DemoPage() {  
  try {
    // Fetch server-side data
    const { registrationStats, hasRpcError } = await getDemoPageData();
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* RPC Error Warning */}
        {hasRpcError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4">
            <div className="flex">
              <div className="py-1">
                <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold">RPC Connection Issue</p>
                <p className="text-sm">
                  Unable to connect to Anvil at <code>http://localhost:8547</code>. 
                  Make sure Anvil is running with: <code>anvil --port 8547</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Server-rendered header with stats */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                zkMed Healthcare Registration Demo
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {registrationStats.totalRegisteredUsers.toString()}
                  </p>
                  <p className="text-sm text-blue-600">Total Users</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {registrationStats.totalPatients.toString()}
                  </p>
                  <p className="text-sm text-green-600">Patients</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {registrationStats.totalHospitals.toString()}
                  </p>
                  <p className="text-sm text-purple-600">Hospitals</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {registrationStats.totalInsurers.toString()}
                  </p>
                  <p className="text-sm text-orange-600">Insurers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client component for interactive features */}
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        }>
          <DemoClient registrationStats={registrationStats} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading demo page:', error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load demo page</p>
          <p className="text-sm text-gray-500 mt-2">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }
} 