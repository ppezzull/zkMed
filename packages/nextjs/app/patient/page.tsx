import { NextPage } from "next";
import PatientDashboard from "~~/components/patient/patient-dashboard";

const PatientPage: NextPage = async () => {
  // Create mock patient data for UI
  const initialPatientData = {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    dateOfBirth: "1985-06-15",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, ST 12345",
  };

  const initialHealthRecords = [
    {
      id: "1",
      title: "Annual Physical Exam",
      description: "Routine annual checkup with vital signs and blood work",
      type: "examination",
      doctorName: "Dr. Smith",
      date: "2024-01-10",
    },
    {
      id: "2",
      title: "Blood Pressure Medication",
      description: "Prescribed Lisinopril 10mg daily for hypertension",
      type: "prescription",
      doctorName: "Dr. Johnson",
      date: "2024-01-05",
    },
  ];

  const initialAppointments = [
    {
      id: "1",
      type: "Follow-up Consultation",
      doctorName: "Dr. Smith",
      status: "scheduled",
      appointmentDate: "2024-01-25",
      time: "14:30",
      location: "City Medical Center, Room 201",
      priority: "medium",
    },
    {
      id: "2",
      type: "Lab Results Review",
      doctorName: "Dr. Johnson",
      status: "completed",
      appointmentDate: "2024-01-15",
      time: "09:00",
      location: "City Medical Center, Lab Wing",
    },
  ];

  return (
    <main className="relative min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl shadow-lg p-6 md:p-8">
          <PatientDashboard
            initialPatientData={initialPatientData}
            initialHealthRecords={initialHealthRecords}
            initialAppointments={initialAppointments}
          />
        </div>
      </div>
    </main>
  );
};

export default PatientPage;
