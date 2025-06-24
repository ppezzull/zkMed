'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  AdminAccessRequest, 
  OrganizationRegistrationRequest, 
  RegistrationStats 
} from '@/utils/types/healthcare';
import { useAdmin } from '@/hooks/useAdmin';

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
  
  const [selectedRequests, setSelectedRequests] = useState<Set<bigint>>(new Set());
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState<bigint | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleBulkApprove = async () => {
    if (selectedRequests.size === 0) return;
    
    try {
      for (const requestId of selectedRequests) {
        await admin.approveRequest(requestId);
      }
      setSelectedRequests(new Set());
      // Refresh data after bulk approval
      window.location.reload();
    } catch (error) {
      console.error('Error in bulk approve:', error);
    }
  };

  const handleApprove = async (requestId: bigint) => {
    try {
      await admin.approveRequest(requestId);
      // Refresh data after approval
      window.location.reload();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId: bigint) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    try {
      await admin.rejectRequest(requestId, rejectReason);
      setRejectModalOpen(false);
      setRejectRequestId(null);
      setRejectReason('');
      // Refresh data after rejection
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const openRejectModal = (requestId: bigint) => {
    setRejectRequestId(requestId);
    setRejectModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage healthcare system registrations and requests</p>
      </div>

      {admin.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{admin.error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialData.registrationStats.totalRegisteredUsers.toString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{initialData.registrationStats.totalPatients.toString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hospitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{initialData.registrationStats.totalHospitals.toString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Insurers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{initialData.registrationStats.totalInsurers.toString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Request Management */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            Review and approve or reject registration requests
          </CardDescription>
          <div className="flex gap-2">
            <Button 
              onClick={handleBulkApprove}
              disabled={selectedRequests.size === 0 || admin.isProcessingRequest}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve Selected ({selectedRequests.size})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="organization" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="organization">
                Organization Requests ({initialData.organizationRequests.length})
              </TabsTrigger>
              <TabsTrigger value="admin">
                Admin Requests ({initialData.adminRequests.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="organization" className="space-y-4">
              {initialData.organizationRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending organization requests</p>
              ) : (
                <div className="space-y-4">
                  {initialData.organizationRequests.map((requestId) => (
                    <RequestCard
                      key={requestId.toString()}
                      requestId={requestId}
                      type="organization"
                      selected={selectedRequests.has(requestId)}
                      onSelect={(id, selected) => {
                        const newSet = new Set(selectedRequests);
                        if (selected) {
                          newSet.add(id);
                        } else {
                          newSet.delete(id);
                        }
                        setSelectedRequests(newSet);
                      }}
                      onApprove={handleApprove}
                      onReject={openRejectModal}
                      isProcessing={admin.isProcessingRequest}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              {initialData.adminRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending admin requests</p>
              ) : (
                <div className="space-y-4">
                  {initialData.adminRequests.map((requestId) => (
                    <RequestCard
                      key={requestId.toString()}
                      requestId={requestId}
                      type="admin"
                      selected={selectedRequests.has(requestId)}
                      onSelect={(id, selected) => {
                        const newSet = new Set(selectedRequests);
                        if (selected) {
                          newSet.add(id);
                        } else {
                          newSet.delete(id);
                        }
                        setSelectedRequests(newSet);
                      }}
                      onApprove={handleApprove}
                      onReject={openRejectModal}
                      isProcessing={admin.isProcessingRequest}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reject Modal */}
      {rejectModalOpen && rejectRequestId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this request:
            </p>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="mb-4"
            />
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectRequestId(null);
                  setRejectReason('');
                }}
                disabled={admin.isProcessingRequest}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleReject(rejectRequestId)}
                disabled={!rejectReason.trim() || admin.isProcessingRequest}
              >
                {admin.isProcessingRequest ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RequestCard({ 
  requestId, 
  type, 
  selected, 
  onSelect, 
  onApprove, 
  onReject, 
  isProcessing 
}: {
  requestId: bigint;
  type: 'organization' | 'admin';
  selected: boolean;
  onSelect: (id: bigint, selected: boolean) => void;
  onApprove: (id: bigint) => void;
  onReject: (id: bigint) => void;
  isProcessing: boolean;
}) {
  const admin = useAdmin();
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestData = async () => {
      setLoading(true);
      try {
        if (type === 'organization') {
          // For organization requests, we'd need to implement getOrganizationRequest
          const baseRequest = await admin.fetchRequestBase(requestId);
          setRequestData(baseRequest);
        } else {
          const adminRequest = await admin.fetchAdminRequest(requestId);
          setRequestData(adminRequest);
        }
      } catch (error) {
        console.error('Error fetching request data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, [requestId, type, admin]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!requestData) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-red-500">Error loading request data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-colors ${selected ? 'bg-blue-50 border-blue-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect(requestId, e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">Request #{requestId.toString()}</h4>
                <Badge variant={type === 'organization' ? 'default' : 'secondary'}>
                  {type === 'organization' ? 'Organization' : 'Admin Access'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                From: {requestData.requester ? `${requestData.requester.slice(0, 6)}...${requestData.requester.slice(-4)}` : 'Unknown'}
              </p>
              {type === 'admin' && requestData.reason && (
                <p className="text-sm text-gray-600 mt-1">
                  Reason: {requestData.reason}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Requested: {requestData.requestTime ? new Date(Number(requestData.requestTime) * 1000).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onApprove(requestId)}
              disabled={isProcessing}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject(requestId)}
              disabled={isProcessing}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 