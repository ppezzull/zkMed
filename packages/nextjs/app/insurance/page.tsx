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
        <main className="relative min-h-screen bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl shadow-lg p-6 text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Insurance Dashboard Unavailable</h1>
              <p className="text-gray-300">Unable to load insurance data</p>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="relative min-h-screen bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl shadow-lg p-6 md:p-8">
            <InsuranceDashboard
              initialOrganizationRecord={organizationRecord}
              initialVerificationData={userVerification}
            />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading insurance data:", error);
    return (
      <main className="relative min-h-screen bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl shadow-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-2">Error</h1>
            <p className="text-gray-300">Failed to load insurance data</p>
          </div>
        </div>
      </main>
    );
  }
};

export default InsurancePage;
