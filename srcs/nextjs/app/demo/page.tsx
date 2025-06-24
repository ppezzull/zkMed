import { Suspense } from 'react';
import { getCurrentUserRole, getUserRecord } from '@/lib/actions/healthcare';
import DemoClient from '@/components/demo/demo-client';

interface DemoPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DemoPage({ searchParams }: DemoPageProps) {
  const resolvedParams = await searchParams;
  
  try {
    // No need to fetch data server-side for demo page since it's wallet-dependent
    // The client component will handle wallet connection and data fetching
    
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      }>
        <DemoClient />
      </Suspense>
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