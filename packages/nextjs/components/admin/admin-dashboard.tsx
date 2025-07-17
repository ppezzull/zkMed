"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle,
  Crown,
  Search,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";
import { useAdmin } from "~~/hooks/useAdmin";
import { RegistrationStats } from "~~/types/healthcare";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  verificationStatus: "pending" | "approved" | "rejected";
  registrationDate: string;
  organizationName: string | null;
}

interface AdminDashboardProps {
  initialData: {
    allPendingRequests: bigint[];
    patientRequests: bigint[];
    organizationRequests: bigint[];
    adminRequests: bigint[];
    registrationStats: RegistrationStats;
    currentFilter: string;
    currentSort: string;
  };
}

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const admin = useAdmin();

  // Extract data from initialData with safety checks
  // Note: initialData preserved for future backend integration
  console.log("Admin dashboard initialized with:", initialData);
  // const stats = initialData?.registrationStats || {
  //   totalPatients: BigInt(0),
  //   totalHospitals: BigInt(0),
  //   totalInsurers: BigInt(0),
  //   totalRegisteredUsers: BigInt(0),
  // };

  // Initialize all users in one array with state management
  const initialUsers: User[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      role: "Patient",
      verificationStatus: "pending",
      registrationDate: "2024-01-15",
      organizationName: null,
    },
    {
      id: "2",
      name: "City General Hospital",
      email: "admin@citygeneral.com",
      role: "Hospital",
      verificationStatus: "pending",
      registrationDate: "2024-01-14",
      organizationName: "City General Hospital",
    },
    {
      id: "3",
      name: "Sarah Connor",
      email: "sarah.connor@email.com",
      role: "Patient",
      verificationStatus: "pending",
      registrationDate: "2024-01-16",
      organizationName: null,
    },
    {
      id: "4",
      name: "HealthSecure Insurance",
      email: "admin@healthsecure.com",
      role: "Insurance",
      verificationStatus: "pending",
      registrationDate: "2024-01-13",
      organizationName: "HealthSecure Insurance",
    },
    {
      id: "5",
      name: "Mary Johnson",
      email: "mary.j@email.com",
      role: "Patient",
      verificationStatus: "approved",
      registrationDate: "2024-01-10",
      organizationName: null,
    },
    {
      id: "6",
      name: "Metro Medical Center",
      email: "contact@metromedical.com",
      role: "Hospital",
      verificationStatus: "approved",
      registrationDate: "2024-01-09",
      organizationName: "Metro Medical Center",
    },
    {
      id: "7",
      name: "Invalid Hospital",
      email: "fake@hospital.com",
      role: "Hospital",
      verificationStatus: "rejected",
      registrationDate: "2024-01-08",
      organizationName: "Invalid Hospital",
    },
    {
      id: "8",
      name: "Fake Insurance Co",
      email: "fake@insurance.com",
      role: "Insurance",
      verificationStatus: "rejected",
      registrationDate: "2024-01-07",
      organizationName: "Fake Insurance Co",
    },
  ];

  // State management for users
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(new Set());

  // Filter users by status
  const pendingUsers = users.filter(user => user.verificationStatus === "pending");
  const approvedUsers = users.filter(user => user.verificationStatus === "approved");
  const rejectedUsers = users.filter(user => user.verificationStatus === "rejected");

  // Stats calculations
  const totalUsers = users.length;
  const totalApproved = approvedUsers.length;
  const totalPending = pendingUsers.length;
  const totalRejected = rejectedUsers.length;

  const isLoading = admin.isProcessingRequest;

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

  const handleApprove = async (userId: string) => {
    console.log("🟢 APPROVE CLICKED - User ID:", userId);
    console.log("🟢 Current users:", users);
    console.log("🟢 Current pending users:", pendingUsers);

    // Add to processing set to show loading state
    setProcessingUsers(prev => {
      console.log("🟢 Adding to processing:", userId);
      return new Set([...prev, userId]);
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Update user status
    setUsers(prevUsers => {
      console.log("🟢 Updating user status for:", userId);
      const updatedUsers = prevUsers.map(user =>
        user.id === userId ? { ...user, verificationStatus: "approved" as const } : user,
      );
      console.log("🟢 Updated users:", updatedUsers);
      return updatedUsers;
    });

    // Remove from processing set
    setProcessingUsers(prev => {
      console.log("🟢 Removing from processing:", userId);
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  const handleReject = async (userId: string) => {
    console.log("🔴 REJECT CLICKED - User ID:", userId);
    console.log("🔴 Current users:", users);
    console.log("🔴 Current pending users:", pendingUsers);

    // Add to processing set to show loading state
    setProcessingUsers(prev => {
      console.log("🔴 Adding to processing:", userId);
      return new Set([...prev, userId]);
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Update user status
    setUsers(prevUsers => {
      console.log("🔴 Updating user status for:", userId);
      const updatedUsers = prevUsers.map(user =>
        user.id === userId ? { ...user, verificationStatus: "rejected" as const } : user,
      );
      console.log("🔴 Updated users:", updatedUsers);
      return updatedUsers;
    });

    // Remove from processing set
    setProcessingUsers(prev => {
      console.log("🔴 Removing from processing:", userId);
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-amber-500/10 text-amber-300 border-amber-500/20", icon: AlertTriangle },
      approved: { color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", icon: CheckCircle },
      rejected: { color: "bg-red-500/10 text-red-300 border-red-500/20", icon: XCircle },
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

  const renderUserCard = (user: User, showActions = false) => {
    const isProcessing = processingUsers.has(user.id);

    return (
      <Card
        key={user.id}
        className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors"
      >
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-white truncate">{user.name}</h3>
                <p className="text-blue-200 text-sm">{user.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {getStatusBadge(user.verificationStatus)}
                  <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">{user.role}</Badge>
                  {user.organizationName && (
                    <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">
                      <Building2 className="w-3 h-3 mr-1" />
                      {user.organizationName}
                    </Badge>
                  )}
                </div>
                <p className="text-slate-400 text-xs mt-2">Registered: {formatDate(user.registrationDate)}</p>
              </div>
            </div>
            {showActions && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => handleApprove(user.id)}
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {isProcessing ? "Processing..." : "Approve"}
                </Button>
                <Button
                  onClick={() => handleReject(user.id)}
                  disabled={isProcessing}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600/10 flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {isProcessing ? "Processing..." : "Reject"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-blue-100">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-blue-200 text-sm">Manage user registrations and system oversight</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">Super Admin</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-white">{totalUsers}</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-white">{totalPending}</p>
                  <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                    <Activity className="w-3 h-3" />
                    Requires attention
                  </p>
                </div>
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Approved</p>
                  <p className="text-2xl font-bold text-white">{totalApproved}</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <UserCheck className="w-3 h-3" />
                    Active users
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Rejected</p>
                  <p className="text-2xl font-bold text-white">{totalRejected}</p>
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <XCircle className="w-3 h-3" />
                    Declined applications
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, or organization..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("all")}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === "pending" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("pending")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Pending
                </Button>
                <Button
                  variant={selectedFilter === "approved" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("approved")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Approved
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              Pending ({totalPending})
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              Approved ({totalApproved})
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              Rejected ({totalRejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingUsers.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No pending registrations</p>
                  <p className="text-slate-500">All registration requests have been processed</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">{pendingUsers.map(user => renderUserCard(user, true))}</div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedUsers.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No approved users</p>
                  <p className="text-slate-500">Approved users will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">{approvedUsers.map(user => renderUserCard(user, false))}</div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedUsers.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <XCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No rejected users</p>
                  <p className="text-slate-500">Rejected users will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">{rejectedUsers.map(user => renderUserCard(user, false))}</div>
            )}
          </TabsContent>
        </Tabs>

        {/* Debug Section */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Stats (Debug)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Real-time statistics and state management information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 max-h-96 overflow-auto">
              <pre
                className="text-xs font-mono text-white whitespace-pre-wrap"
                style={{ color: "#ffffff", backgroundColor: "transparent" }}
              >
                {JSON.stringify(
                  convertBigIntForJSON({
                    realTimeStats: {
                      totalUsers,
                      totalPending,
                      totalApproved,
                      totalRejected,
                      processingCount: processingUsers.size,
                    },
                    userDistribution: {
                      byRole: {
                        Patient: users.filter(u => u.role === "Patient").length,
                        Hospital: users.filter(u => u.role === "Hospital").length,
                        Insurance: users.filter(u => u.role === "Insurance").length,
                      },
                      byStatus: {
                        pending: pendingUsers.length,
                        approved: approvedUsers.length,
                        rejected: rejectedUsers.length,
                      },
                    },
                    currentState: {
                      searchTerm,
                      selectedFilter,
                      processingUsers: Array.from(processingUsers),
                    },
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
