'use client';

import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/types/healthcare';

export default function OrganizationPage() {
  const account = useActiveAccount();
  const registration = useHealthcareRegistration();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account?.address) {
      registration.checkUserRole().finally(() => setLoading(false));
    }
  }, [account?.address]);

  // Redirect if not an organization
  useEffect(() => {
    if (!loading && registration.isRegistered && registration.userRole === UserType.PATIENT) {
      window.location.href = '/patient';
    } else if (!loading && !registration.isRegistered) {
      window.location.href = '/';
    }
  }, [loading, registration.isRegistered, registration.userRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              You need to connect your wallet to access your organization dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!registration.isRegistered || 
      (registration.userRole !== UserType.HOSPITAL && registration.userRole !== UserType.INSURER)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You need to be registered as a hospital or insurance company to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isHospital = registration.userRole === UserType.HOSPITAL;
  const organizationType = isHospital ? 'Hospital' : 'Insurance Company';

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your {organizationType} Dashboard
          </h1>
          <p className="text-gray-600">
            {isHospital 
              ? 'Manage patient records and healthcare data securely on the blockchain.'
              : 'Process insurance claims and manage policies with blockchain transparency.'
            }
          </p>
        </div>

        {/* Organization Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{organizationType} Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Organization Name:</span>
                <p className="font-semibold">{registration.userRecord?.organizationName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Domain:</span>
                <p className="font-mono text-sm">{registration.userRecord?.domain || 'N/A'}</p>
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
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
                  isHospital 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  Verified {organizationType}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {isHospital ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Patients Served</span>
                    <span className="text-2xl font-bold text-blue-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Records Created</span>
                    <span className="text-2xl font-bold text-green-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Active Cases</span>
                    <span className="text-2xl font-bold text-orange-600">0</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Claims Processed</span>
                    <span className="text-2xl font-bold text-blue-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Active Policies</span>
                    <span className="text-2xl font-bold text-green-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Pending Claims</span>
                    <span className="text-2xl font-bold text-orange-600">0</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📋</div>
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isHospital ? (
            <>
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="text-blue-600 text-3xl mb-4">👥</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Management</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Register new patients and manage their medical records securely.
                </p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  Manage Patients →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="text-green-600 text-3xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Records</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Create, update, and share medical records with authorized parties.
                </p>
                <button className="text-green-600 text-sm font-medium hover:text-green-800">
                  Manage Records →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="text-purple-600 text-3xl mb-4">🏥</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hospital Analytics</h3>
                <p className="text-gray-600 text-sm mb-4">
                  View analytics and insights about your hospital operations.
                </p>
                <button className="text-purple-600 text-sm font-medium hover:text-purple-800">
                  View Analytics →
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="text-blue-600 text-3xl mb-4">📄</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Claims Processing</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Review and process insurance claims from verified healthcare providers.
                </p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  Process Claims →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="text-green-600 text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Management</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Manage insurance policies and coverage for your clients.
                </p>
                <button className="text-green-600 text-sm font-medium hover:text-green-800">
                  Manage Policies →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="text-purple-600 text-3xl mb-4">💰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Reports</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Generate financial reports and track claim payouts.
                </p>
                <button className="text-purple-600 text-sm font-medium hover:text-purple-800">
                  View Reports →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Domain Verification Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Domain Verification</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-green-600 mr-3">✓</div>
              <div>
                <p className="font-medium text-green-800">Domain Verified</p>
                <p className="text-sm text-green-600">
                  Your organization domain <span className="font-mono">{registration.userRecord?.domain}</span> has been successfully verified through email proof.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">More Features Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              We're building advanced features to streamline healthcare operations with blockchain technology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">🔄</div>
                <span className="text-sm text-gray-600">Inter-org Data Sharing</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <span className="text-sm text-gray-600">Mobile Apps</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🤖</div>
                <span className="text-sm text-gray-600">AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 