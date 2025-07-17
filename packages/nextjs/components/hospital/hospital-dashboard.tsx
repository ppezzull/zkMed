"use client";

import { useState } from "react";
import {
  Activity,
  BedDouble,
  Building2,
  Calendar,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Shield,
  Star,
  Stethoscope,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";
import { OrganizationRecord } from "~~/types/healthcare";

interface HospitalInfo {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  specialties: string[];
  bedCount: number;
  staffCount: number;
  emergencyServices: boolean;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  status: string;
  admissionDate: string;
  room: string;
  assignedDoctor: string;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  appointmentDate: string;
  time: string;
  type: string;
  doctorName: string;
  status: string;
  priority: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: string;
  status: string;
  contactNumber: string;
  emergencyContact: string;
}

interface HospitalDashboardProps {
  initialOrganizationRecord: OrganizationRecord;
  initialVerificationData: any;
}

export default function HospitalDashboard({
  initialOrganizationRecord,
  initialVerificationData,
}: HospitalDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with real data from props or API calls
  const hospitalInfo: HospitalInfo = {
    id: "1",
    name: initialOrganizationRecord.organizationName || "City General Hospital",
    address: "123 Medical Center Drive, Healthcare City, HC 12345",
    phoneNumber: "+1 (555) 987-6543",
    email: "info@citygeneralhospital.com",
    licenseNumber: "HL-2024-001234",
    specialties: ["Cardiology", "Neurology", "Oncology", "Emergency Medicine", "Pediatrics"],
    bedCount: 350,
    staffCount: 1200,
    emergencyServices: true,
  };

  const patientRecords: Patient[] = [
    {
      id: "1",
      name: "John Doe",
      age: 45,
      diagnosis: "Hypertension",
      status: "Stable",
      admissionDate: "2024-01-15",
      room: "302A",
      assignedDoctor: "Dr. Smith",
    },
    {
      id: "2",
      name: "Jane Smith",
      age: 32,
      diagnosis: "Pneumonia",
      status: "Recovering",
      admissionDate: "2024-01-18",
      room: "205B",
      assignedDoctor: "Dr. Johnson",
    },
    {
      id: "3",
      name: "Robert Wilson",
      age: 67,
      diagnosis: "Diabetes Type 2",
      status: "Stable",
      admissionDate: "2024-01-20",
      room: "401C",
      assignedDoctor: "Dr. Brown",
    },
  ];

  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "Alice Johnson",
      patientId: "P001",
      appointmentDate: "2024-01-25",
      time: "09:00",
      type: "Consultation",
      doctorName: "Dr. Smith",
      status: "scheduled",
      priority: "medium",
    },
    {
      id: "2",
      patientName: "Mike Davis",
      patientId: "P002",
      appointmentDate: "2024-01-25",
      time: "10:30",
      type: "Surgery",
      doctorName: "Dr. Wilson",
      status: "confirmed",
      priority: "high",
    },
    {
      id: "3",
      patientName: "Sarah Brown",
      patientId: "P003",
      appointmentDate: "2024-01-25",
      time: "14:00",
      type: "Follow-up",
      doctorName: "Dr. Johnson",
      status: "scheduled",
      priority: "low",
    },
  ];

  const staffMembers: Staff[] = [
    {
      id: "1",
      name: "Dr. Emily Smith",
      role: "Cardiologist",
      department: "Cardiology",
      shift: "Day",
      status: "Active",
      contactNumber: "+1 (555) 123-4567",
      emergencyContact: "+1 (555) 987-6543",
    },
    {
      id: "2",
      name: "Nurse Jennifer Wilson",
      role: "Registered Nurse",
      department: "Emergency",
      shift: "Night",
      status: "Active",
      contactNumber: "+1 (555) 234-5678",
      emergencyContact: "+1 (555) 876-5432",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      stable: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      recovering: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      critical: "bg-red-500/20 text-red-400 border-red-500/30",
      scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.scheduled;

    return <Badge className={`${config} capitalize`}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: "bg-red-500/20 text-red-400 border-red-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      low: "bg-green-500/20 text-green-400 border-green-500/30",
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

    return <Badge className={`${config} capitalize`}>{priority} Priority</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Helper function to convert BigInt values for JSON serialization
  const convertBigIntForJSON = (obj: any): any => {
    if (typeof obj === "bigint") {
      return obj.toString();
    }
    if (Array.isArray(obj)) {
      return obj.map(convertBigIntForJSON);
    }
    if (obj !== null && typeof obj === "object") {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = convertBigIntForJSON(value);
      }
      return result;
    }
    return obj;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Hospital Portal</h1>
                <p className="text-blue-200 text-sm">Manage patients, staff, and hospital operations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                <Shield className="w-3 h-3 mr-1" />
                Verified Hospital
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hospital Info & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hospital Profile Card */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-white truncate">{hospitalInfo.name}</h2>
                  <p className="text-blue-200 text-sm mb-3">{hospitalInfo.email}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span>{hospitalInfo.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>{hospitalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{hospitalInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span>{hospitalInfo.specialties.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Hospital Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Total Beds</span>
                <span className="text-xl font-bold text-white">{hospitalInfo.bedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Staff Members</span>
                <span className="text-xl font-bold text-white">{hospitalInfo.staffCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Today&apos;s Appointments</span>
                <span className="text-xl font-bold text-white">{appointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Active Patients</span>
                <span className="text-xl font-bold text-white">{patientRecords.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Today&apos;s Appointments</p>
                  <p className="text-2xl font-bold text-white">
                    {appointments.filter(a => a.appointmentDate === new Date().toISOString().split("T")[0]).length}
                  </p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    12% from yesterday
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Available Beds</p>
                  <p className="text-2xl font-bold text-white">{hospitalInfo.bedCount - 45}</p>
                  <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                    <BedDouble className="w-3 h-3" />
                    82% capacity
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <BedDouble className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Active Staff</p>
                  <p className="text-2xl font-bold text-white">
                    {staffMembers.filter(s => s.status === "Active").length}
                  </p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <UserCheck className="w-3 h-3" />
                    On duty today
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Patient Records</p>
                  <p className="text-2xl font-bold text-white">{patientRecords.length}</p>
                  <p className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                    <FileText className="w-3 h-3" />
                    Digital records
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Appointment
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Manage Staff
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <BedDouble className="w-4 h-4" />
                Bed Management
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search patients, staff, appointments..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Appointments ({appointments.length})
            </TabsTrigger>
            <TabsTrigger
              value="patients"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Users className="w-4 h-4 mr-2" />
              Patients ({patientRecords.length})
            </TabsTrigger>
            <TabsTrigger
              value="staff"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Staff ({staffMembers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            {appointments.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No appointments scheduled</p>
                  <p className="text-slate-500 mb-4">Schedule the first appointment to get started</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <Card
                    key={appointment.id}
                    className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-white">{appointment.type}</h3>
                            <p className="text-blue-200 text-sm">{appointment.patientName}</p>
                            <p className="text-slate-400 text-xs">{appointment.patientId}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {getStatusBadge(appointment.status)}
                              {appointment.priority && getPriorityBadge(appointment.priority)}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(appointment.appointmentDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointment.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Stethoscope className="w-4 h-4" />
                                {appointment.doctorName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                            View Details
                          </Button>
                          <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/10">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            {patientRecords.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No patient records</p>
                  <p className="text-slate-500">Patient records will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {patientRecords.map(record => (
                  <Card
                    key={record.id}
                    className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-white">{record.name}</h3>
                          <p className="text-blue-200 text-sm">Condition: {record.diagnosis}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {getStatusBadge(record.status)}
                            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">
                              {record.assignedDoctor}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-xs mt-2">
                            Admission Date: {formatDate(record.admissionDate)}
                          </p>
                          <p className="text-slate-400 text-xs">Room: {record.room}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            View Record
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            {staffMembers.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No staff members</p>
                  <p className="text-slate-500">Staff members will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {staffMembers.map(member => (
                  <Card
                    key={member.id}
                    className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                          <p className="text-blue-200 text-sm">{member.role}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {getStatusBadge(member.status)}
                            <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">
                              {member.department}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {member.contactNumber}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {member.emergencyContact}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-purple-600 text-purple-400 hover:bg-purple-600/10"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Debug Section */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Full Hospital Record (Debug)
            </CardTitle>
            <CardDescription className="text-slate-400">Complete hospital data for debugging purposes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 max-h-96 overflow-auto">
              <pre
                className="text-xs font-mono text-white whitespace-pre-wrap"
                style={{ color: "#ffffff", backgroundColor: "transparent" }}
              >
                {JSON.stringify(
                  convertBigIntForJSON({
                    initialOrganizationRecord,
                    initialVerificationData,
                    hospitalInfo,
                    appointments,
                    staffMembers,
                    patientRecords,
                  }),
                  null,
                  2,
                )}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
