import { NextPage } from "next";
import PatientDashboard from "~~/components/patient/patient-dashboard";
import { mockGetPatientRecord, mockGetUserVerificationData } from "~~/lib/mock-data";

interface PatientPageProps {
  params: {
    address: string;
  };
}

const PatientPage: NextPage<PatientPageProps> = async ({ params }) => {
  const { address } = params;

  // Fetch mock data for the patient
  const patientRecord = await mockGetPatientRecord(address);
  const userVerification = await mockGetUserVerificationData(address);

  const initialData = {
    patientRecord,
    userVerification,
    walletAddress: address,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <PatientDashboard initialData={initialData} />
    </main>
  );
};

export default PatientPage;
