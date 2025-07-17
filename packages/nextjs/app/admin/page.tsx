import { NextPage } from "next";
import AdminDashboard from "~~/components/admin/admin-dashboard";
import { mockGetPendingRequests, mockGetPendingRequestsByType, mockGetRegistrationStats } from "~~/lib/mock-data";
import { RequestType } from "~~/types/healthcare";

const AdminPage: NextPage = async () => {
  // Fetch all the mock data
  const registrationStats = await mockGetRegistrationStats();
  const allPendingRequests = await mockGetPendingRequests();
  const patientRequests = await mockGetPendingRequestsByType(RequestType.PATIENT_REGISTRATION);
  const organizationRequests = await mockGetPendingRequestsByType(RequestType.ORG_REGISTRATION);
  const adminRequests = await mockGetPendingRequestsByType(RequestType.ADMIN_ACCESS);

  const initialData = {
    allPendingRequests,
    patientRequests,
    organizationRequests,
    adminRequests,
    registrationStats,
    currentFilter: "",
    currentSort: "",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminDashboard initialData={initialData} />
    </main>
  );
};

export default AdminPage;
