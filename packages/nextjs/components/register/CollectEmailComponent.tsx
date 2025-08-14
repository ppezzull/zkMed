"use client";

import React, { useEffect } from "react";
import type { HealthcareRole } from "./RoleSelectionComponent";
import { Mail } from "lucide-react";
import { useZkMedInbox } from "~~/hooks/zkMed/useZkMedInbox";

interface CollectEmailComponentProps {
  emailId: string;
  role: HealthcareRole;
  onEmailReceived: (emlContent: string) => void;
  onBack: () => void;
}

/**
 * Collect Email Component
 *
 * Second step in registration workflow where users upload their
 * received email response for verification
 */
export function CollectEmailComponent({ emailId, role, onEmailReceived, onBack }: CollectEmailComponentProps) {
  // Use the real email inbox hook
  const { emlFetched, emlContent, isLoading, error } = useZkMedInbox(emailId);

  // Call onEmailReceived when email is fetched
  useEffect(() => {
    if (emlFetched && emlContent) {
      onEmailReceived(emlContent);
    }
  }, [emlFetched, emlContent, onEmailReceived]);

  return (
    <div className="min-h-screen">
      {/* Unified Header + Progress */}
      <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Join zkMed</h1>
              <p className="text-gray-300">Complete your registration to access healthcare services</p>
            </div>
            <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
              ← Back
            </button>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-cyan-300">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                ✓
              </div>
              <span className="text-sm font-medium">Choose Role</span>
            </div>

            {role !== "PATIENT" && (
              <>
                <div className="w-8 h-0.5 bg-slate-600"></div>
                <div className="flex items-center space-x-2 text-cyan-300">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    ✓
                  </div>
                  <span className="text-sm font-medium">Organization Details</span>
                </div>
              </>
            )}

            <div className="w-8 h-0.5 bg-slate-600"></div>

            <div className="flex items-center space-x-2 text-cyan-300">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                ✓
              </div>
              <span className="text-sm font-medium">Email Verification</span>
            </div>

            <div className="w-8 h-0.5 bg-slate-600"></div>

            <div className="flex items-center space-x-2 text-cyan-300">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                {role === "PATIENT" ? "3" : "4"}
              </div>
              <span className="text-sm font-medium">Waiting for Email</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-white">Waiting for Email</h2>

            {isLoading && (
              <div className="mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Checking for your email... This may take a few moments.</p>
                <p className="text-sm text-gray-400 mt-2">Email ID: {emailId}</p>
              </div>
            )}

            {!isLoading && !emlFetched && !error && (
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 border border-slate-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-7 h-7 text-gray-400" />
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  We&apos;re waiting to receive your email. Make sure you&apos;ve sent the email with the exact subject
                  line provided.
                </p>
                <p className="text-sm text-gray-400">Email ID: {emailId}</p>
              </div>
            )}

            {error && (
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 border border-red-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-7 h-7 text-red-400" />
                  </div>
                </div>
                <p className="text-red-300 mb-4">Error fetching email: {error}</p>
                <p className="text-sm text-gray-400">Email ID: {emailId}</p>
              </div>
            )}

            <div className="mt-8 p-4 bg-slate-700 border border-slate-600 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-semibold text-cyan-300 mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-300 space-y-1 text-left">
                <li>• We&apos;ll automatically detect when your email arrives</li>
                <li>• The email will be processed to generate a cryptographic proof</li>
                <li>• Your registration will be submitted to the blockchain</li>
                {role !== "PATIENT" && <li>• Your organization registration will be pending admin approval</li>}
              </ul>
            </div>

            <div className="flex justify-center mt-8">
              <button onClick={onBack} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
