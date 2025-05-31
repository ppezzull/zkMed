// Complete zkMed Application
// filepath: /app/page.tsx

'use client';

import { useState } from 'react';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { UserRegistration } from '../components/UserRegistration';
import { EmailVerification } from '../components/EmailVerification';
import { RoleManagement } from '../components/RoleManagement';
import { OrganizationVerification } from '../components/OrganizationVerification';

type Tab = 'register' | 'email' | 'role' | 'organization';

export default function ZkMedApp() {
  const account = useActiveAccount();
  const [activeTab, setActiveTab] = useState<Tab>('register');

  const tabs = [
    { id: 'register', label: 'Registration', component: UserRegistration },
    { id: 'email', label: 'Email Verification', component: EmailVerification },
    { id: 'role', label: 'Role Management', component: RoleManagement },
    { id: 'organization', label: 'Organization', component: OrganizationVerification },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || UserRegistration;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">zk</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">zkMed</h1>
              <span className="text-sm text-gray-500">Medical Registration System</span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {account ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </nav>

              {/* System Info */}
              <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">System Info</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Network: Anvil Local</p>
                  <p>Chain ID: 31337</p>
                  <p>Status: ✅ Connected</p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <ActiveComponent />
            </div>
          </div>
        ) : (
          /* Welcome Screen */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">zk</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to zkMed</h2>
              <p className="text-gray-600 mb-8">
                A privacy-preserving medical registration system using zero-knowledge proofs
                and blockchain technology.
              </p>
              
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">Email Domain Verification</p>
                      <p className="text-sm text-gray-600">Verify institutional affiliation using vlayer</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">Role-Based Access</p>
                      <p className="text-sm text-gray-600">Patient, Doctor, and Organization roles</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">Privacy-Preserving</p>
                      <p className="text-sm text-gray-600">Zero-knowledge proofs protect sensitive data</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">Blockchain Security</p>
                      <p className="text-sm text-gray-600">Immutable registration records</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Connect your wallet to get started
              </p>
              <ConnectButton />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>zkMed - Privacy-preserving medical registration system</p>
            <p className="mt-1">Built with vlayer, thirdweb, and Next.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
