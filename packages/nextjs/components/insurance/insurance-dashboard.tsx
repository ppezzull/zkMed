"use client";

import { useState } from "react";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Shield,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";
import { OrganizationRecord } from "~~/types/healthcare";

// Types for UI components
interface InsuranceInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  coverageTypes: string[];
  activePolicies: number;
}

interface PolicyHolder {
  id: string;
  name: string;
  policyNumber: string;
  coverageType: string;
  premiumAmount: number;
  status: string;
  startDate: string;
  endDate: string;
  dependents: number;
}

interface Coverage {
  id: string;
  type: string;
  coverage: string;
  premium: number;
  deductible: number;
  maxCoverage: number;
  status: string;
}

interface InsuranceDashboardProps {
  initialOrganizationRecord: OrganizationRecord;
  initialVerificationData: any;
}

export default function InsuranceDashboard({
  initialOrganizationRecord,
  initialVerificationData,
}: InsuranceDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with real data from props or API calls
  const insuranceInfo: InsuranceInfo = {
    id: "1",
    name: initialOrganizationRecord.organizationName || "MediCare Insurance Co.",
    email: "claims@medicare-ins.com",
    phone: "+1 (555) 987-6543",
    address: "456 Insurance Plaza, Medical District, MD 67890",
    licenseNumber: "INS-2024-567890",
    coverageTypes: ["Health", "Dental", "Vision", "Prescription", "Mental Health"],
    activePolicies: 4, // Updated to match Total Contracts
  };

  const policyHolders: PolicyHolder[] = [
    {
      id: "1",
      name: "John Smith",
      policyNumber: "POL-2024-001",
      coverageType: "Premium Health",
      premiumAmount: 450.0,
      status: "active",
      startDate: "2023-01-01",
      endDate: "2024-12-31",
      dependents: 0,
    },
    {
      id: "2",
      name: "Mary Johnson",
      policyNumber: "POL-2024-002",
      coverageType: "Basic Health",
      premiumAmount: 280.0,
      status: "active",
      startDate: "2023-03-01",
      endDate: "2024-02-28",
      dependents: 1,
    },
    {
      id: "3",
      name: "Sarah Connor",
      policyNumber: "POL-2024-003",
      coverageType: "Premium Health",
      premiumAmount: 450.0,
      status: "active",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      dependents: 2,
    },
    {
      id: "4",
      name: "Robert Brown",
      policyNumber: "POL-2024-004",
      coverageType: "Basic Health",
      premiumAmount: 280.0,
      status: "pending",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      dependents: 0,
    },
  ];

  const coverageTypes: Coverage[] = [
    {
      id: "1",
      type: "Premium Health",
      coverage: "Comprehensive",
      premium: 450.0,
      deductible: 500.0,
      maxCoverage: 100000.0,
      status: "active",
    },
    {
      id: "2",
      type: "Basic Health",
      coverage: "Essential",
      premium: 280.0,
      deductible: 1000.0,
      maxCoverage: 50000.0,
      status: "active",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-amber-500/10 text-amber-300 border-amber-500/20", icon: Clock },
      approved: { color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", icon: CheckCircle },
      rejected: { color: "bg-red-500/10 text-red-300 border-red-500/20", icon: XCircle },
      active: { color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", icon: CheckCircle },
      inactive: { color: "bg-slate-500/10 text-slate-300 border-slate-500/20", icon: XCircle },
      cancelled: { color: "bg-red-500/10 text-red-300 border-red-500/20", icon: XCircle },
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
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Insurance Portal</h1>
                <p className="text-blue-200 text-sm">Manage policies and member coverage</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                <Shield className="w-3 h-3 mr-1" />
                Licensed Insurer
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Insurance Info & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Insurance Profile Card */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-white truncate">{insuranceInfo.name}</h2>
                  <p className="text-blue-200 text-sm mb-3">License: {insuranceInfo.licenseNumber}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span>{insuranceInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>{insuranceInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{insuranceInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span>{insuranceInfo.coverageTypes.join(", ")}</span>
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
                Business Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Total Members</span>
                <span className="text-xl font-bold text-white">{policyHolders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Active Policies</span>
                <span className="text-xl font-bold text-white">
                  {policyHolders.filter(p => p.status === "active").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Coverage Types</span>
                <span className="text-xl font-bold text-white">{coverageTypes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Pending Approvals</span>
                <span className="text-xl font-bold text-white">
                  {policyHolders.filter(p => p.status === "pending").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Management Section */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Insurance Contracts
            </CardTitle>
            <CardDescription className="text-slate-400">
              Manage and track insurance contracts sent to patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Contract Stats */}
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Contracts</p>
                    <p className="text-2xl font-bold text-white">{policyHolders.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Pending Approval</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {policyHolders.filter(p => p.status === "pending").length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active Patients</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {policyHolders.filter(p => p.status === "active").length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Bar with Reorganized Buttons */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              {/* Action Buttons in Requested Order */}
              <Button
                onClick={() => (window.location.href = "/insurance/send-contract")}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Send New Contract
              </Button>
              <Button
                onClick={() => (window.location.href = "/insurance/history")}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                View Contract History
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Manage Members
              </Button>
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search members, policies..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs - Only Members and Coverage */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Users className="w-4 h-4 mr-2" />
              Members ({policyHolders.length})
            </TabsTrigger>
            <TabsTrigger
              value="coverage"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Shield className="w-4 h-4 mr-2" />
              Policy ({coverageTypes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            {policyHolders.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No policy holders</p>
                  <p className="text-slate-500">Policy holders will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {policyHolders.map(member => (
                  <Card
                    key={member.id}
                    className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                          <p className="text-blue-200 text-sm">{member.coverageType}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {getStatusBadge(member.status)}
                            <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">
                              {member.coverageType}
                            </Badge>
                            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">
                              {member.policyNumber}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Premium: {formatCurrency(member.premiumAmount)}/month
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Joined: {formatDate(member.startDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            View Policy
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

          <TabsContent value="coverage" className="space-y-4">
            {coverageTypes.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No coverage plans</p>
                  <p className="text-slate-500">Coverage plans will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {coverageTypes.map(coverage => (
                  <Card
                    key={coverage.id}
                    className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-white">{coverage.type}</h3>
                          <p className="text-blue-200 text-sm">{coverage.coverage} Coverage Plan</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {getStatusBadge(coverage.status)}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-sm">
                            <div className="text-slate-300">
                              <span className="text-slate-400">Premium: </span>
                              <span className="text-emerald-400 font-semibold">
                                {formatCurrency(coverage.premium)}/month
                              </span>
                            </div>
                            <div className="text-slate-300">
                              <span className="text-slate-400">Deductible: </span>
                              <span className="text-amber-400 font-semibold">
                                {formatCurrency(coverage.deductible)}
                              </span>
                            </div>
                            <div className="text-slate-300">
                              <span className="text-slate-400">Max Coverage: </span>
                              <span className="text-blue-400 font-semibold">
                                {formatCurrency(coverage.maxCoverage)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            View Plan
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
              Full Insurance Record (Debug)
            </CardTitle>
            <CardDescription className="text-slate-400">Complete insurance data for debugging purposes</CardDescription>
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
                    insuranceInfo,
                    policyHolders,
                    coverageTypes,
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
