"use client";

import { useEffect, useState } from "react";
import { useHospital } from "~~/hooks/useHospital";
import { mockGetOrganizationRecord, mockGetUserVerificationData } from "~~/lib/mock-data";
import { OrganizationRecord, UserType } from "~~/types/healthcare";
import { safeStringify } from "~~/utils/serialization";

interface HospitalDashboardProps {
  address: string;
  initialOrganizationRecord: OrganizationRecord | null;
  initialVerificationData: any | null;
}

export default function HospitalDashboard({
  address,
  initialOrganizationRecord,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialVerificationData,
}: HospitalDashboardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hospital = useHospital();
  const [isRegistered, setIsRegistered] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [organizationRecord, setOrganizationRecord] = useState<OrganizationRecord | null>(initialOrganizationRecord);
  const [loading, setLoading] = useState(true);

  // Check registration status
  useEffect(() => {
    const checkRegistration = async () => {
      try {
        // Use mock data instead of actual contract calls
        const verification = await mockGetUserVerificationData(address);
        if (verification && verification.isActive) {
          setIsRegistered(true);
          setUserType(verification.userType);

          // Fetch organization record if registered as hospital
          if (verification.userType === UserType.HOSPITAL) {
            const record = await mockGetOrganizationRecord(address);
            setOrganizationRecord(record);
          }
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRegistration();
  }, [address]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600 text-sm">Checking registration status...</p>
        </div>
      </div>
    );
  }

  // Access denied if not registered as hospital
  if (!isRegistered || userType !== UserType.HOSPITAL) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            {!isRegistered
              ? "You are not registered in the zkMed system."
              : "You don't have hospital access privileges."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/register")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register Now
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full text-gray-600 py-2 px-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Hospital dashboard content
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your Hospital Dashboard</h1>
          <p className="text-gray-600">Manage patient records and healthcare services securely on the blockchain.</p>
        </div>

        {/* Hospital Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Organization Name:</span>
                <p className="text-sm font-medium">{organizationRecord?.organizationName || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Domain:</span>
                <p className="text-sm font-medium">{organizationRecord?.domain || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Wallet Address:</span>
                <p className="font-mono text-sm break-all">{organizationRecord?.base.walletAddress || address}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Registration Date:</span>
                <p className="text-sm">
                  {organizationRecord?.base.registrationTime
                    ? new Date(Number(organizationRecord.base.registrationTime)).toISOString().split("T")[0]
                    : "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email Hash:</span>
                <p className="font-mono text-xs break-all">{organizationRecord?.base.emailHash || "N/A"}</p>
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
        {organizationRecord && (
          <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Full User Record</h3>
            <pre
              className="bg-white border border-gray-300 p-4 rounded-lg text-sm overflow-auto font-mono whitespace-pre-wrap shadow-inner"
              style={{ color: "#000000", backgroundColor: "#ffffff" }}
            >
              {safeStringify(organizationRecord, 2)}
            </pre>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-green-600 text-3xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Management</h3>
            <p className="text-gray-600 text-sm mb-4">Manage patient records and access permissions securely.</p>
            <button className="text-green-600 text-sm font-medium hover:text-green-800">Manage Patients →</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Records</h3>
            <p className="text-gray-600 text-sm mb-4">Create and manage encrypted medical records on the blockchain.</p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">Manage Records →</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-purple-600 text-3xl mb-4">💊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Treatment Plans</h3>
            <p className="text-gray-600 text-sm mb-4">Create and track treatment plans and prescriptions.</p>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-800">Manage Treatments →</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-orange-600 text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">View hospital performance metrics and patient analytics.</p>
            <button className="text-orange-600 text-sm font-medium hover:text-orange-800">View Analytics →</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-red-600 text-3xl mb-4">🚨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency</h3>
            <p className="text-gray-600 text-sm mb-4">Emergency patient access and critical care management.</p>
            <button className="text-red-600 text-sm font-medium hover:text-red-800">Emergency Access →</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-indigo-600 text-3xl mb-4">🔗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrations</h3>
            <p className="text-gray-600 text-sm mb-4">Connect with insurance providers and other healthcare systems.</p>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">Manage Integrations →</button>
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
