import { NextPage } from "next";
import HospitalDashboard from "~~/components/hospital/hospital-dashboard";
import { mockGetDefaultOrganizationRecord, mockGetDefaultUserVerificationData } from "~~/lib/mock-data";

const HospitalPage: NextPage = async () => {
  try {
    // Get default organization and verification data
    const [organizationRecord, userVerification] = await Promise.all([
      mockGetDefaultOrganizationRecord("hospital"),
      mockGetDefaultUserVerificationData("hospital"),
    ]);

    if (!organizationRecord) {
      return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hospital Dashboard Unavailable</h1>
            <p className="text-gray-600">Unable to load hospital data</p>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-gray-50">
        <HospitalDashboard initialOrganizationRecord={organizationRecord} initialVerificationData={userVerification} />
      </main>
    );
  } catch (error) {
    console.error("Error loading hospital data:", error);
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load hospital data</p>
        </div>
      </main>
    );
  }
};

export default HospitalPage;
