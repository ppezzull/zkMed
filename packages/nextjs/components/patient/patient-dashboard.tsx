"use client";

import { useState } from "react";
import { Calendar, DollarSign, FileText, Mail, MapPin, Phone, Plus, Search, Shield, User, Wallet } from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";

// Types for UI components
interface PatientInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}

interface PatientDashboardProps {
  initialPatientData: PatientInfo;
  initialHealthRecords: any[];
  initialAppointments: any[];
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
        <div className="grid grid-cols-1 gap-6">
          {/* Patient Profile Card */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
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

        {/* Search Bar Only */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              />
            </div>
          </CardContent>
        </Card>

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
