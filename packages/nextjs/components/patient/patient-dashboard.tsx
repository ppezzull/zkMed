"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  Pill,
  Plus,
  Search,
  Shield,
  Stethoscope,
  Thermometer,
  User,
  Wallet,
} from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";

// Types for UI components
interface PatientInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}

interface HealthRecord {
  id: string;
  title: string;
  description: string;
  type: string;
  doctorName: string;
  date: string;
}

interface Appointment {
  id: string;
  type: string;
  doctorName: string;
  status: string;
  appointmentDate: string;
  time: string;
  location?: string;
  priority?: string;
}

interface PatientDashboardProps {
  initialPatientData: PatientInfo;
  initialHealthRecords: HealthRecord[];
  initialAppointments: Appointment[];
}

export default function PatientDashboard({
  initialPatientData,
  initialHealthRecords,
  initialAppointments,
}: PatientDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const getAppointmentStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-500/10 text-blue-300 border-blue-500/20", icon: Clock },
      completed: { color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", icon: CheckCircle },
      cancelled: { color: "bg-red-500/10 text-red-300 border-red-500/20", icon: AlertTriangle },
      pending: { color: "bg-amber-500/10 text-amber-300 border-amber-500/20", icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} capitalize flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { color: "bg-red-500/10 text-red-300 border-red-500/20" },
      medium: { color: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
      low: { color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

    return <Badge className={`${config.color} capitalize`}>{priority} Priority</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Patient Portal</h1>
                <p className="text-blue-200 text-sm">Manage your health records and appointments</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                <Shield className="w-3 h-3 mr-1" />
                Verified Patient
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section & Patient Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Profile Card */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-white truncate">{initialPatientData.name}</h2>
                  <p className="text-blue-200 text-sm mb-3">{initialPatientData.email}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>Born: {formatDate(initialPatientData.dateOfBirth)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span>{initialPatientData.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{initialPatientData.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>{initialPatientData.email}</span>
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
                Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Health Records</span>
                <span className="text-xl font-bold text-white">{initialHealthRecords.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Appointments</span>
                <span className="text-xl font-bold text-white">{initialAppointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Last Visit</span>
                <span className="text-sm text-blue-300">
                  {initialAppointments.length > 0
                    ? formatDate(initialAppointments[0].appointmentDate)
                    : "No visits yet"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Notification Banner */}
        <div className="mb-8">
          <Card className="bg-amber-500/10 border-amber-500/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-semibold">New Insurance Contract Available</h3>
                    <p className="text-slate-300 text-sm">
                      You have a pending insurance contract from HealthSecure Insurance
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => (window.location.href = "/patient/sign-contract")}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Sign Contract
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wallet and Insurance Status Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Wallet Panel */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Current Balance</p>
                    <p className="text-2xl font-bold text-white">$75.00</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Next Payment Due</p>
                    <p className="text-slate-300 text-sm">March 1, 2024 - $50.00</p>
                  </div>
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Money
              </Button>
            </CardContent>
          </Card>

          {/* Insurance Status Panel */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Insurance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg space-y-2">
                <h4 className="text-white font-semibold">Contract Details</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Provider:</span>
                    <span className="text-slate-300">HealthSecure Insurance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-slate-300">12 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Rate:</span>
                    <span className="text-slate-300">$50.00</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <h5 className="text-emerald-400 font-semibold text-sm">Payment History</h5>
                <p className="text-slate-300 text-xs mt-1">No payments yet - Contract pending signature</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Information Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Patient Info */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>{initialPatientData.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Born {initialPatientData.dateOfBirth}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>{initialPatientData.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{initialPatientData.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>{initialPatientData.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Health Records</span>
                <span className="text-xl font-bold text-white">{initialHealthRecords.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Appointments</span>
                <span className="text-xl font-bold text-white">{initialAppointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Last Visit</span>
                <span className="text-sm text-blue-300">
                  {initialAppointments.length > 0
                    ? formatDate(initialAppointments[0].appointmentDate)
                    : "No visits yet"}
                </span>
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
                Book Appointment
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Request Records
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Health Summary
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search records, appointments..."
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
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Appointments ({initialAppointments.length})
            </TabsTrigger>
            <TabsTrigger
              value="records"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Health Records ({initialHealthRecords.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            {initialAppointments.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No appointments scheduled</p>
                  <p className="text-slate-500 mb-4">Book your first appointment to get started</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {initialAppointments.map(appointment => (
                  <Card
                    key={appointment.id}
                    className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Stethoscope className="w-6 h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-white">{appointment.type}</h3>
                            <p className="text-blue-200 text-sm">Dr. {appointment.doctorName}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {getAppointmentStatusBadge(appointment.status)}
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
                                <MapPin className="w-4 h-4" />
                                {appointment.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                            View Details
                          </Button>
                          {appointment.status === "scheduled" && (
                            <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            {initialHealthRecords.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No health records available</p>
                  <p className="text-slate-500 mb-4">Your medical records will appear here</p>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Request Records
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {initialHealthRecords.map(record => (
                  <Card
                    key={record.id}
                    className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          {record.type === "prescription" ? (
                            <Pill className="w-6 h-6 text-white" />
                          ) : record.type === "lab_result" ? (
                            <Thermometer className="w-6 h-6 text-white" />
                          ) : (
                            <FileText className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-white">{record.title}</h3>
                          <p className="text-blue-200 text-sm">{record.description}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 capitalize">
                              {record.type.replace("_", " ")}
                            </Badge>
                            <span className="text-xs text-slate-400">Dr. {record.doctorName}</span>
                          </div>
                          <p className="text-slate-400 text-xs mt-2">Date: {formatDate(record.date)}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            Download
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
              Full Patient Record (Debug)
            </CardTitle>
            <CardDescription className="text-slate-400">Complete patient data for debugging purposes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 max-h-96 overflow-auto">
              <pre
                className="text-xs font-mono text-white whitespace-pre-wrap"
                style={{ color: "#ffffff", backgroundColor: "transparent" }}
              >
                {JSON.stringify({ initialPatientData, initialHealthRecords, initialAppointments }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
