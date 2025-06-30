'use client';

import { useEffect } from 'react';
import { useZkMedInbox } from '@/hooks/useZkMedInbox';

interface CollectEmailProps {
  emailId: string;
  role: 'PATIENT' | 'HOSPITAL' | 'INSURER';
  onEmailReceived: (emlContent: string) => void;
  onBack: () => void;
}

export default function CollectEmail({ emailId, role, onEmailReceived, onBack }: CollectEmailProps) {
  const { emlFetched, emlContent, isLoading, error } = useZkMedInbox(emailId);

  // Add debugging logs
  console.log("🔍 DEBUG - CollectEmail component:");
  console.log("🔍 DEBUG - Email ID:", emailId);
  console.log("🔍 DEBUG - Role:", role);
  console.log("🔍 DEBUG - Is loading:", isLoading);
  console.log("🔍 DEBUG - Error:", error);
  console.log("🔍 DEBUG - EML fetched:", emlFetched);
  console.log("🔍 DEBUG - EML content preview:", emlContent?.substring(0, 100));

  // Auto-proceed when email is fetched
  useEffect(() => {
    if (emlFetched && emlContent) {
      console.log("🔍 DEBUG - Proceeding with email content:");
      console.log("🔍 DEBUG - Content length:", emlContent.length);
      console.log("🔍 DEBUG - Is Nexthoop email?", emlContent.includes('nexthoop.it'));
      console.log("🔍 DEBUG - Is Gmail email?", emlContent.includes('gmail.com'));
      
      onEmailReceived(emlContent);
    }
  }, [emlFetched, emlContent, onEmailReceived]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Join zkMed</h1>
              <p className="text-gray-600">Complete your registration to access healthcare services</p>
            </div>
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 py-4">
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                ✓
              </div>
              <span className="text-sm font-medium">Choose Role</span>
            </div>
            
            {role !== 'PATIENT' && (
              <>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                    ✓
                  </div>
                  <span className="text-sm font-medium">Organization Details</span>
                </div>
              </>
            )}

            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                ✓
              </div>
              <span className="text-sm font-medium">Email Verification</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                {role === 'PATIENT' ? '3' : '4'}
              </div>
              <span className="text-sm font-medium">Waiting for Email</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Waiting for Email</h2>
            
            {isLoading && (
              <div className="mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">
                  Checking for your email... This may take a few moments.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Email ID: {emailId}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Error fetching email</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {!isLoading && !error && !emlFetched && (
              <div className="mb-6">
                <div className="text-6xl mb-4">📧</div>
                <p className="text-gray-600 mb-4">
                  We're waiting to receive your email. Make sure you've sent the email with the exact subject line provided.
                </p>
                <p className="text-sm text-gray-500">
                  Email ID: {emailId}
                </p>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• We'll automatically detect when your email arrives</li>
                <li>• The email will be processed to generate a cryptographic proof</li>
                <li>• Your registration will be submitted to the blockchain</li>
                {role !== 'PATIENT' && (
                  <li>• Your organization registration will be pending admin approval</li>
                )}
              </ul>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 