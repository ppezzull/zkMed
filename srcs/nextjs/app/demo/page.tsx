import { Suspense } from 'react';
import DemoClient from '@/components/demo/demo-client';
import { getRegistrationStats } from '@/lib/actions/admin';
import { isLoggedIn } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export default async function DemoPage() {  
  try {
    const registrationStats = await getRegistrationStats();
    
    return (
      <div>
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
    
    // Check if this is an RPC connection error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const isRPCError = errorMessage.includes('fetch') || 
                      errorMessage.includes('network') || 
                      errorMessage.includes('connect') ||
                      errorMessage.includes('ECONNREFUSED');
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {isRPCError ? '🔗 Blockchain Connection Required' : '❌ Demo Unavailable'}
            </h1>
            
            {isRPCError ? (
              <>
                <p className="text-gray-600 mb-6">
                  The zkMed demo requires a local blockchain connection to work properly.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-semibold text-blue-900 mb-4">
                    🚀 Quick Start Instructions
                  </h2>
                  <div className="text-left space-y-4">
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-2">1. Start Anvil (Local Blockchain):</p>
                      <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                        anvil --port 8547 --host 0.0.0.0
                      </code>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-2">2. Deploy Contracts (in another terminal):</p>
                      <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                        cd zkMed/srcs/foundry && forge script script/HealthcareRegistration.s.sol --broadcast --rpc-url http://localhost:8547
                      </code>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-2">3. Refresh this page</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> Make sure you have Foundry installed. If not, visit{' '}
                    <a href="https://book.getfoundry.sh/getting-started/installation" 
                       className="text-yellow-600 underline hover:text-yellow-700"
                       target="_blank" rel="noopener noreferrer">
                      getfoundry.sh
                    </a>
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  There was an error loading the demo page. Please try again or contact support.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">
                    <strong>Error details:</strong> {errorMessage}
                  </p>
                </div>
              </>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                🔄 Retry
              </button>
              <a 
                href="/register" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                📝 Go to Registration
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
} 