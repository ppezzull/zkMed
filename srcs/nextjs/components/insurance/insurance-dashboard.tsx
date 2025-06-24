'use client';

import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useInsurance } from '@/hooks/useInsurance';
import { UserType, OrganizationRecord } from '@/utils/types/healthcare';
import { useRouter } from 'next/navigation';
import WalletConnect from '@/components/wallet-connect';
import { safeStringify } from '@/utils/serialization';

interface InsuranceDashboardProps {
  address: string;
  initialOrganizationRecord: OrganizationRecord | null;
  initialVerificationData: any | null; // We can add proper type later
}

export default function InsuranceDashboard({ 
  address, 
  initialOrganizationRecord, 
  initialVerificationData 
}: InsuranceDashboardProps) {
  const account = useActiveAccount();
  const router = useRouter();
  const insurance = useInsurance();
  const [isRegistered, setIsRegistered] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [organizationRecord, setOrganizationRecord] = useState<OrganizationRecord | null>(initialOrganizationRecord);
  const [loading, setLoading] = useState(true);

  // Check registration status
  useEffect(() => {
    const checkRegistration = async () => {
      if (!account?.address) return;
      
      try {
        const verification = await insurance.fetchUserVerification(account.address);
        if (verification?.isRegistered) {
          setIsRegistered(true);
          setUserType(verification.userType);
          
          // Fetch organization record if registered as insurer
          if (verification.userType === UserType.INSURER) {
            const record = await insurance.fetchInsuranceRecord(account.address);
            setOrganizationRecord(record);
          }
        }
      } catch (error) {
        console.error('Error checking registration:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRegistration();
  }, [account?.address, insurance]);

  // Redirect if not connected to correct wallet
  useEffect(() => {
    if (account?.address && account.address.toLowerCase() !== address.toLowerCase()) {
      router.push('/');
    }
  }, [account?.address, address, router]);

  // Show wallet connection if not connected
  if (!account?.address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to access the insurance dashboard.
          </p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600 text-sm">
            Checking registration status...
          </p>
        </div>
      </div>
    );
  }

  // Access denied if not registered as insurer
  if (!isRegistered || userType !== UserType.INSURER) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            {!isRegistered 
              ? "You are not registered in the zkMed system."
              : "You don't have insurance company access privileges."
            }
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/register')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register Now
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full text-gray-600 py-2 px-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Insurance dashboard content
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your Insurance Dashboard
          </h1>
          <p className="text-gray-600">
            Manage insurance claims and healthcare coverage securely on the blockchain.
          </p>
        </div>

        {/* Insurance Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Company Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Organization Name:</span>
                <p className="text-sm font-medium">{organizationRecord?.organizationName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Domain:</span>
                <p className="text-sm font-medium">{organizationRecord?.domain || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Wallet Address:</span>
                <p className="font-mono text-sm break-all">{account.address}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Registration Date:</span>
                <p className="text-sm">
                  {organizationRecord?.registrationTime 
                    ? new Date(Number(organizationRecord.registrationTime) * 1000).toLocaleDateString()
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email Hash:</span>
                <p className="font-mono text-xs break-all">
                  {organizationRecord?.emailHash || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 ml-2">
                  Active Insurer
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Policies</span>
                <span className="text-2xl font-bold text-purple-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Claims Processed</span>
                <span className="text-2xl font-bold text-green-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Coverage</span>
                <span className="text-2xl font-bold text-blue-600">$0</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">🏢</div>
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>

        {/* User Record Details */}
        {organizationRecord && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Full User Record</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
              {safeStringify(organizationRecord, 2)}
            </pre>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-purple-600 text-3xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Management</h3>
            <p className="text-gray-600 text-sm mb-4">
              Create and manage insurance policies for healthcare coverage.
            </p>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-800">
              Manage Policies →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-green-600 text-3xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Claims Processing</h3>
            <p className="text-gray-600 text-sm mb-4">
              Review, approve, and process insurance claims efficiently.
            </p>
            <button className="text-green-600 text-sm font-medium hover:text-green-800">
              Process Claims →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Member Management</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage insurance members and their coverage details.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              Manage Members →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-orange-600 text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">
              Analyze risk factors and optimize coverage strategies.
            </p>
            <button className="text-orange-600 text-sm font-medium hover:text-orange-800">
              View Analytics →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-red-600 text-3xl mb-4">🚨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fraud Detection</h3>
            <p className="text-gray-600 text-sm mb-4">
              Monitor and detect potential fraudulent claims and activities.
            </p>
            <button className="text-red-600 text-sm font-medium hover:text-red-800">
              Fraud Dashboard →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-indigo-600 text-3xl mb-4">🔗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Provider Network</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage relationships with healthcare providers and hospitals.
            </p>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              Manage Network →
            </button>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Insurance Features</h2>
            <p className="text-gray-600 mb-6">
              Next-generation insurance technology features are coming soon.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">🤖</div>
                <span className="text-sm text-gray-600">AI Risk Assessment</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <span className="text-sm text-gray-600">Instant Claims</span>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🌐</div>
                <span className="text-sm text-gray-600">Global Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 