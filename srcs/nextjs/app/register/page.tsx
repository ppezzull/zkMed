import { Suspense } from 'react';
import RegisterClient from '@/components/register/register-client';

export default async function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600 text-sm">
            Preparing registration...
          </p>
        </div>
      </div>
    }>
      <RegisterClient />
    </Suspense>
  );
} 