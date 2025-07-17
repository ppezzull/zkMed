"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Search,
  Shield,
  Star,
} from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { OrganizationRecord } from "~~/types/healthcare";

interface HospitalInfo {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  specialties: string[];
}

interface Reimbursement {
  id: string;
  type: "to_patient" | "to_hospital";
  amount: number;
  patientName: string;
  patientId: string;
  treatmentType: string;
  insuranceProvider: string;
  date: string;
  status: "pending" | "processed" | "approved" | "rejected";
  claimNumber: string;
  description: string;
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
  };

  const reimbursements: Reimbursement[] = [
    {
      id: "2",
      type: "to_hospital",
      amount: 15750.0,
      patientName: "Jane Smith",
      patientId: "P002",
      treatmentType: "Cardiac Procedure",
      insuranceProvider: "MediCare Premium",
      date: "2024-01-24",
      status: "approved",
      claimNumber: "CLM-2024-002",
      description: "Cardiac catheterization procedure - hospital reimbursement",
    },
    {
      id: "4",
      type: "to_hospital",
      amount: 8200.0,
      patientName: "Alice Johnson",
      patientId: "P004",
      treatmentType: "Orthopedic Surgery",
      insuranceProvider: "HealthCare Plus",
      date: "2024-01-22",
      status: "processed",
      claimNumber: "CLM-2024-004",
      description: "Knee replacement surgery - hospital facility reimbursement",
    },
    {
      id: "6",
      type: "to_hospital",
      amount: 12400.0,
      patientName: "Sarah Brown",
      patientId: "P006",
      treatmentType: "Neurological Treatment",
      insuranceProvider: "MediCare Premium",
      date: "2024-01-20",
      status: "rejected",
      claimNumber: "CLM-2024-006",
      description: "Brain scan and consultation - requires additional documentation",
    },
    {
      id: "7",
      type: "to_hospital",
      amount: 5600.0,
      patientName: "Michael Davis",
      patientId: "P007",
      treatmentType: "Emergency Treatment",
      insuranceProvider: "Universal Health",
      date: "2024-01-19",
      status: "pending",
      claimNumber: "CLM-2024-007",
      description: "Emergency room treatment and diagnostics - hospital reimbursement",
    },
    {
      id: "8",
      type: "to_hospital",
      amount: 9800.0,
      patientName: "Emily Wilson",
      patientId: "P008",
      treatmentType: "Surgical Procedure",
      insuranceProvider: "StateHealth Insurance",
      date: "2024-01-18",
      status: "approved",
      claimNumber: "CLM-2024-008",
      description: "Appendectomy surgery - hospital facility and equipment reimbursement",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      processed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending;

    return <Badge className={`${config} capitalize`}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate totals - only hospital reimbursements
  const totalHospitalReimbursements = reimbursements
    .filter(r => r.status !== "rejected")
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingReimbursements = reimbursements.filter(r => r.status === "pending").length;
  const processedThisMonth = reimbursements.filter(r => r.status === "processed" || r.status === "approved").length;
  const rejectedClaims = reimbursements.filter(r => r.status === "rejected").length;

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

  // Filter reimbursements based on search term
  const filteredReimbursements = reimbursements.filter(
    reimbursement =>
      reimbursement.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reimbursement.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reimbursement.treatmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reimbursement.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reimbursement.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
                <p className="text-blue-200 text-sm">Insurance reimbursement management</p>
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
        {/* Hospital Info */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
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

        {/* Reimbursement Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Hospital Reimbursements</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalHospitalReimbursements)}</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <ArrowDownLeft className="w-3 h-3" />
                    This month
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Pending Claims</p>
                  <p className="text-2xl font-bold text-white">{pendingReimbursements}</p>
                  <p className="text-xs text-yellow-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    Awaiting approval
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Processed</p>
                  <p className="text-2xl font-bold text-white">{processedThisMonth}</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3" />
                    This month
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Rejected Claims</p>
                  <p className="text-2xl font-bold text-white">{rejectedClaims}</p>
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <Shield className="w-3 h-3" />
                    This month
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search hospital reimbursements, patients, claim numbers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reimbursements List */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Hospital Insurance Reimbursements
            </CardTitle>
            <CardDescription className="text-slate-400">
              Track insurance payments received by the hospital
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredReimbursements.length === 0 ? (
              <div className="py-12 text-center">
                <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 text-lg">No reimbursements found</p>
                <p className="text-slate-500">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredReimbursements.map(reimbursement => (
                <Card
                  key={reimbursement.id}
                  className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ArrowDownLeft className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white">{formatCurrency(reimbursement.amount)}</h3>
                            <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                              Hospital Reimbursement
                            </Badge>
                          </div>
                          <p className="text-blue-200 text-sm">
                            {reimbursement.patientName} ({reimbursement.patientId})
                          </p>
                          <p className="text-slate-400 text-sm">{reimbursement.treatmentType}</p>
                          <p className="text-slate-400 text-xs mt-1">{reimbursement.description}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {getStatusBadge(reimbursement.status)}
                            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">
                              {reimbursement.insuranceProvider}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(reimbursement.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Receipt className="w-4 h-4" />
                              {reimbursement.claimNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          View Details
                        </Button>
                        {reimbursement.status === "pending" && (
                          <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/10">
                            Process Claim
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

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
                    reimbursements,
                    totalHospitalReimbursements,
                    pendingReimbursements,
                    processedThisMonth,
                    rejectedClaims,
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
