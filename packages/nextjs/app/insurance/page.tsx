import { NextPage } from "next";
import InsuranceDashboard from "~~/components/insurance/insurance-dashboard";
import { mockGetDefaultOrganizationRecord, mockGetDefaultUserVerificationData } from "~~/lib/mock-data";

const InsurancePage: NextPage = async () => {
  try {
    // Get default organization and verification data
    const [organizationRecord, userVerification] = await Promise.all([
      mockGetDefaultOrganizationRecord("insurance"),
      mockGetDefaultUserVerificationData("insurance"),
    ]);

    if (!organizationRecord) {
      return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Insurance Dashboard Unavailable</h1>
            <p className="text-gray-600">Unable to load insurance data</p>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-gray-50">
        <InsuranceDashboard initialOrganizationRecord={organizationRecord} initialVerificationData={userVerification} />
      </main>
    );
  } catch (error) {
    console.error("Error loading insurance data:", error);
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load insurance data</p>
        </div>
      </main>
    );
  }
};

export default InsurancePage;
