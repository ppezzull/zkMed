'use client';

import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/actions/healthcare-registration';

export default function PatientPage() {
  const account = useActiveAccount();
  const registration = useHealthcareRegistration();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account?.address) {
      registration.checkUserRole().finally(() => setLoading(false));
    }
  }, [account?.address]);

  // Redirect if not a patient
  useEffect(() => {
    if (!loading && registration.isRegistered && registration.userRole !== UserType.PATIENT) {
      if (registration.userRole === UserType.HOSPITAL || registration.userRole === UserType.INSURER) {
        window.location.href = '/organization';
      } else {
        window.location.href = '/';
      }
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
              You need to connect your wallet to access your patient dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!registration.isRegistered || registration.userRole !== UserType.PATIENT) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You need to be registered as a patient to access this page.
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
            Welcome to your Patient Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your medical records and healthcare data securely on the blockchain.
          </p>
        </div>

        {/* Patient Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
            <div className="space-y-2">
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                  Active Patient
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Medical Records</span>
                <span className="text-2xl font-bold text-blue-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Hospital Visits</span>
                <span className="text-2xl font-bold text-green-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Insurance Claims</span>
                <span className="text-2xl font-bold text-purple-600">0</span>
              </div>
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
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">🏥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Records</h3>
            <p className="text-gray-600 text-sm mb-4">
              View and manage your medical records from verified healthcare providers.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              View Records →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-green-600 text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Settings</h3>
            <p className="text-gray-600 text-sm mb-4">
              Control who can access your medical data and for what purposes.
            </p>
            <button className="text-green-600 text-sm font-medium hover:text-green-800">
              Manage Privacy →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-purple-600 text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get insights into your health data and medical history trends.
            </p>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-800">
              View Analytics →
            </button>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">More Features Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              We're working on exciting new features to enhance your healthcare experience with blockchain technology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">🔄</div>
                <span className="text-sm text-gray-600">Data Sharing</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <span className="text-sm text-gray-600">Mobile App</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🤖</div>
                <span className="text-sm text-gray-600">AI Insights</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 