'use client';

import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';

export default function AdminPage() {
  const account = useActiveAccount();
  const registration = useHealthcareRegistration();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account?.address) {
      registration.checkUserRole().finally(() => setLoading(false));
    }
  }, [account?.address]);

  // TODO: Check if user is admin
  // For now, just check if user is registered

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
              You need to connect your wallet to access the admin dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // TODO: Add proper admin check
  // For now, allowing access to all registered users for demo purposes

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage healthcare registrations and oversee system operations.
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Patients</dt>
                  <dd className="text-2xl font-bold text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">🏥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Hospitals</dt>
                  <dd className="text-2xl font-bold text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">🏢</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Insurers</dt>
                  <dd className="text-2xl font-bold text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-lg">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
                  <dd className="text-2xl font-bold text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button className="py-4 px-6 border-b-2 border-indigo-500 text-indigo-600 font-medium text-sm">
                Pending Registrations
              </button>
              <button className="py-4 px-6 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                All Users
              </button>
              <button className="py-4 px-6 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                System Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Pending Registrations */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Organization Registration Requests
              </h3>
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-500">
                  All organization registration requests will appear here for approval.
                </p>
              </div>
            </div>

            {/* Sample pending request structure */}
            {/* 
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Hospital
                    </span>
                    <h4 className="ml-3 text-lg font-medium text-gray-900">General Hospital NYC</h4>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Domain:</span> generalhospital.com
                    </div>
                    <div>
                      <span className="font-medium">Wallet:</span> 0x1234...5678
                    </div>
                    <div>
                      <span className="font-medium">Email Verified:</span> ✅ Yes
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> 2 hours ago
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Approve
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>
            </div>
            */}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Register Patient</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manually register a patient in the system.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              Register Patient →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-green-600 text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">
              View detailed system usage and performance metrics.
            </p>
            <button className="text-green-600 text-sm font-medium hover:text-green-800">
              View Analytics →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-purple-600 text-3xl mb-4">⚙️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600 text-sm mb-4">
              Configure system parameters and security settings.
            </p>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-800">
              Manage Settings →
            </button>
          </div>
        </div>

        {/* Current Admin Info */}
        {account?.address && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Admin Session</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Admin Address:</span>
                <p className="font-mono text-gray-900">{account.address}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Session Started:</span>
                <p className="text-gray-900">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 