"use client";

import { useState } from "react";
import { CheckCircle, Clock, DollarSign, Eye, FileText, Search, XCircle } from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";

interface Contract {
  id: string;
  patientName: string;
  patientWallet: string;
  patientEmail: string;
  duration: number;
  monthlyRate: number;
  totalValue: number;
  sentDate: string;
  startDate: string;
  endDate: string;
  status: "pending" | "accepted" | "rejected" | "expired";
}

// Mock contract data
const mockContracts: Contract[] = [
  {
    id: "CTR-001",
    patientName: "John Smith",
    patientWallet: "0x1234...5678",
    patientEmail: "john.smith@email.com",
    duration: 12,
    monthlyRate: 50,
    totalValue: 600,
    sentDate: "2024-01-20",
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    status: "pending",
  },
  {
    id: "CTR-002",
    patientName: "Mary Johnson",
    patientWallet: "0x2345...6789",
    patientEmail: "mary.j@email.com",
    duration: 24,
    monthlyRate: 75,
    totalValue: 1800,
    sentDate: "2024-01-15",
    startDate: "2024-01-20",
    endDate: "2026-01-19",
    status: "accepted",
  },
  {
    id: "CTR-003",
    patientName: "Robert Wilson",
    patientWallet: "0x3456...7890",
    patientEmail: "robert.w@email.com",
    duration: 6,
    monthlyRate: 40,
    totalValue: 240,
    sentDate: "2024-01-10",
    startDate: "2024-01-15",
    endDate: "2024-07-14",
    status: "rejected",
  },
  {
    id: "CTR-004",
    patientName: "Sarah Brown",
    patientWallet: "0x4567...8901",
    patientEmail: "sarah.b@email.com",
    duration: 18,
    monthlyRate: 65,
    totalValue: 1170,
    sentDate: "2024-01-08",
    startDate: "2024-01-12",
    endDate: "2025-07-11",
    status: "accepted",
  },
];

export default function ContractHistoryTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Contract["status"]>("all");

  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch =
      contract.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.patientWallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Contract["status"]) => {
    const statusConfig = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      accepted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
      expired: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };

    const icons = {
      pending: Clock,
      accepted: CheckCircle,
      rejected: XCircle,
      expired: XCircle,
    };

    const Icon = icons[status];
    const config = statusConfig[status];

    return (
      <Badge className={`${config} capitalize flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Contract Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by patient name, email, wallet, or contract ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as "all" | Contract["status"])}
                className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Contracts</p>
                <p className="text-2xl font-bold text-white">{mockContracts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-white">
                  {mockContracts.filter(c => c.status === "pending").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium">Accepted</p>
                <p className="text-2xl font-bold text-white">
                  {mockContracts.filter(c => c.status === "accepted").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(
                    mockContracts.filter(c => c.status === "accepted").reduce((sum, c) => sum + c.totalValue, 0),
                  )}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Table */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Contract History ({filteredContracts.length})</CardTitle>
          <CardDescription className="text-slate-400">Track all insurance contracts and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 text-lg">No contracts found</p>
              <p className="text-slate-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No contracts have been sent yet"}
              </p>
              <Button
                onClick={() => (window.location.href = "/insurance/send-contract")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send Your First Contract
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContracts.map(contract => (
                <div
                  key={contract.id}
                  className="p-6 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{contract.patientName}</h3>
                        {getStatusBadge(contract.status)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Contract ID</p>
                          <p className="text-slate-300 font-mono">{contract.id}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Patient Email</p>
                          <p className="text-slate-300">{contract.patientEmail}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Wallet</p>
                          <p className="text-slate-300 font-mono">{contract.patientWallet}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Duration</p>
                          <p className="text-slate-300">{contract.duration} months</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Monthly Rate</p>
                          <p className="text-slate-300">{formatCurrency(contract.monthlyRate)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Total Value</p>
                          <p className="text-emerald-400 font-semibold">{formatCurrency(contract.totalValue)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Sent Date</p>
                          <p className="text-slate-300">{formatDate(contract.sentDate)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Contract Period</p>
                          <p className="text-slate-300">
                            {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 min-w-0 sm:min-w-[120px]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      {contract.status === "pending" && (
                        <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600/10">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
