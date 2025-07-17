import InsuranceDashboard from "~~/components/insurance/insurance-dashboard";
import { mockGetOrganizationRecord, mockGetUserVerificationData } from "~~/lib/mock-data";

interface PageProps {
  params: {
    address: string;
  };
}

export default async function InsurancePage({ params }: PageProps) {
  const { address } = await params;

  try {
    // Get organization and verification data in parallel
    const [organizationRecord, userVerification] = await Promise.all([
      mockGetOrganizationRecord(address),
      mockGetUserVerificationData(address),
    ]);

    if (!organizationRecord) {
      return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Organization Not Found</h1>
            <p className="text-gray-600">No organization record found for address {address}</p>
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
}
