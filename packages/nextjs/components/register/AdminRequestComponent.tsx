"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

enum AdminRole {
  BASIC = 0,
  MODERATOR = 1,
  SUPER_ADMIN = 2,
}

interface AdminRequestComponentProps {
  onBack: () => void;
}

/**
 * Admin Request Component
 *
 * Allows users to request administrative access to the zkMed platform
 */
export function AdminRequestComponent({ onBack }: AdminRequestComponentProps) {
  const { user } = usePrivy();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<AdminRole>(AdminRole.BASIC);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Redirect if user is not connected
  useEffect(() => {
    if (!user?.wallet?.address) {
      router.push("/");
    }
  }, [user?.wallet?.address, router]);

  const handleSubmit = async () => {
    if (!user?.wallet?.address || !reason.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Mock implementation - in real app this would submit to blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsComplete(true);

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push("/dashboard/admin");
      }, 2000);
    } catch (error: any) {
      setError(error?.message || "Failed to submit admin request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if user is not connected
  if (!user?.wallet?.address) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Join zkMed</h1>
              <p className="text-gray-800">Complete your registration to access healthcare services</p>
            </div>
            {!isComplete && (
              <button onClick={onBack} className="text-gray-500 hover:text-gray-700 transition-colors">
                ← Back
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 py-4">
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">✓</div>
              <span className="text-sm font-medium">Choose Role</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>

            <div className={`flex items-center space-x-2 ${isComplete ? "text-green-600" : "text-blue-600"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isComplete ? "bg-green-100" : "bg-blue-100"}`}
              >
                {isComplete ? "✓" : "2"}
              </div>
              <span className="text-sm font-medium">Admin Request</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center max-w-2xl mx-auto">
            {isComplete ? (
              <>
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-green-800 mb-4">Request Submitted!</h2>
                <p className="text-gray-800 mb-4">
                  Your admin access request has been submitted successfully. A current administrator will review your
                  request.
                </p>
                <p className="text-sm text-gray-500">Redirecting you to the admin dashboard...</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Request Admin Access</h2>
                <p className="text-gray-800 mb-6">
                  Request administrative access to the zkMed platform. Your request will be reviewed by current
                  administrators.
                </p>

                <div className="space-y-6 text-left">
                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Requested Admin Role</label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="adminRole"
                          value={AdminRole.BASIC}
                          checked={selectedRole === AdminRole.BASIC}
                          onChange={() => setSelectedRole(AdminRole.BASIC)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">Basic Admin</div>
                          <div className="text-sm text-gray-600">Basic administrative privileges for routine tasks</div>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="adminRole"
                          value={AdminRole.MODERATOR}
                          checked={selectedRole === AdminRole.MODERATOR}
                          onChange={() => setSelectedRole(AdminRole.MODERATOR)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">Moderator</div>
                          <div className="text-sm text-gray-600">
                            Enhanced privileges including user management and registration approval
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Request
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="Please explain why you need admin access and your qualifications..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Provide a detailed explanation to help administrators review your request
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Super Admin roles cannot be requested and are appointment-only</li>
                      <li>• Your request will be reviewed by current administrators</li>
                      <li>• You&apos;ll be notified of the decision through the platform</li>
                      <li>• Only legitimate requests with proper justification will be approved</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={!reason.trim() || isSubmitting}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      reason.trim() && !isSubmitting
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
