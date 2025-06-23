'use client';

import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/types/healthcare';
import { useParams, useRouter } from 'next/navigation';
import { safeStringify } from '@/utils/serialization';

export default function HospitalPage() {
  const params = useParams();
  const router = useRouter();
  const account = useActiveAccount();
  const registration = useHealthcareRegistration();
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (account?.address) {
      registration.checkUserRole().then(() => {
        setDataFetched(true);
      }).catch(() => {
        setDataFetched(true); // Set to true even on error so we can show error state
      });
    } else {
      setDataFetched(true); // No account, can show "connect wallet" message
    }
  }, [account?.address]);

  // Security check: ensure user can only access their own page
  useEffect(() => {
    if (account?.address && params.address && account.address !== params.address) {
      router.push('/');
      return;
    }
  }, [account?.address, params.address, router]);

  // Redirect if not a hospital (only after data is fetched)
  useEffect(() => {
    if (dataFetched && registration.isRegistered && registration.userRole !== UserType.HOSPITAL) {
      if (registration.userRole === UserType.PATIENT) {
        router.push(`/patient/${account?.address}`);
      } else if (registration.userRole === UserType.INSURER) {
        router.push(`/insurance/${account?.address}`);
      } else {
        router.push('/');
      }
    }
  }, [dataFetched, registration.isRegistered, registration.userRole, account?.address, router]);

  // Show loading spinner until data is fetched
  if (!dataFetched || registration.loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-4 text-gray-600">Loading hospital data...</span>
        </div>
      </div>
    );
  }

  if (!account?.address) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Please connect your wallet
            </h1>
            <p className="text-gray-600">
              You need to connect your wallet to access your hospital dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!registration.isRegistered || registration.userRole !== UserType.HOSPITAL) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You need to be registered as a hospital to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your Hospital Dashboard
          </h1>
          <p className="text-gray-600">
            Manage patient records and healthcare services securely on the blockchain.
          </p>
        </div>

        {/* Hospital Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Organization Name:</span>
                <p className="text-sm font-medium">{registration.userRecord?.organizationName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Domain:</span>
                <p className="text-sm font-medium">{registration.userRecord?.domain || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Wallet Address:</span>
                <p className="font-mono text-sm break-all">{account.address}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Registration Date:</span>
                <p className="text-sm">
                  {registration.userRecord?.registrationTime 
                    ? new Date(Number(registration.userRecord.registrationTime) * 1000).toLocaleDateString()
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email Hash:</span>
                <p className="font-mono text-xs break-all">
                  {registration.userRecord?.emailHash || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                  Active Hospital
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Patients</span>
                <span className="text-2xl font-bold text-green-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Medical Records</span>
                <span className="text-2xl font-bold text-blue-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Treatments</span>
                <span className="text-2xl font-bold text-purple-600">0</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">🏥</div>
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>

        {/* User Record Details */}
        {registration.userRecord && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Full User Record</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
              {safeStringify(registration.userRecord, 2)}
            </pre>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-green-600 text-3xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Management</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage patient records and access permissions securely.
            </p>
            <button className="text-green-600 text-sm font-medium hover:text-green-800">
              Manage Patients →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Records</h3>
            <p className="text-gray-600 text-sm mb-4">
              Create and manage encrypted medical records on the blockchain.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              Manage Records →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-purple-600 text-3xl mb-4">💊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Treatment Plans</h3>
            <p className="text-gray-600 text-sm mb-4">
              Create and track treatment plans and prescriptions.
            </p>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-800">
              Manage Treatments →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-orange-600 text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">
              View hospital performance metrics and patient analytics.
            </p>
            <button className="text-orange-600 text-sm font-medium hover:text-orange-800">
              View Analytics →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-red-600 text-3xl mb-4">🚨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency</h3>
            <p className="text-gray-600 text-sm mb-4">
              Emergency patient access and critical care management.
            </p>
            <button className="text-red-600 text-sm font-medium hover:text-red-800">
              Emergency Access →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-indigo-600 text-3xl mb-4">🔗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrations</h3>
            <p className="text-gray-600 text-sm mb-4">
              Connect with insurance providers and other healthcare systems.
            </p>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              Manage Integrations →
            </button>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Hospital Features</h2>
            <p className="text-gray-600 mb-6">
              Enhanced features for comprehensive hospital management are coming soon.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">🤖</div>
                <span className="text-sm text-gray-600">AI Diagnostics</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <span className="text-sm text-gray-600">Mobile Integration</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🌐</div>
                <span className="text-sm text-gray-600">Telemedicine</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 