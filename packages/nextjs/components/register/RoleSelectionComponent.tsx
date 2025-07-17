"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Building2, Crown, Shield, User } from "lucide-react";

/**
 * Healthcare Role Types
 *
 * Defines the available roles in the zkMed healthcare platform
 */
export type HealthcareRole = "PATIENT" | "HOSPITAL" | "INSURER" | "ADMIN";

interface RoleSelectionProps {
  onRoleSelect?: (role: HealthcareRole) => void;
}

/**
 * Role Selection Component
 *
 * Allows users to choose their role in the zkMed healthcare platform.
 * Each role has different registration requirements and access permissions.
 */
export function RoleSelectionComponent({ onRoleSelect }: RoleSelectionProps) {
  const router = useRouter();
  const { user } = usePrivy();

  const handleRoleSelection = (role: HealthcareRole) => {
    if (onRoleSelect) {
      onRoleSelect(role);
      return;
    }

    // Default navigation logic if no onRoleSelect provided
    switch (role) {
      case "PATIENT":
        router.push("/register/patient");
        break;
      case "HOSPITAL":
        router.push("/register/organization?type=HOSPITAL");
        break;
      case "INSURER":
        router.push("/register/organization?type=INSURER");
        break;
      case "ADMIN":
        router.push("/register/admin");
        break;
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  // Don't render if user is not connected
  if (!user?.wallet?.address) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-2xl font-bold text-white">Connect your wallet to continue</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Join zkMed</h1>
              <p className="text-gray-300">Complete your registration to access healthcare services</p>
            </div>
            <button onClick={handleBack} className="text-gray-400 hover:text-white transition-colors">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 py-4">
            <div className="flex items-center space-x-2 text-cyan-300">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                1
              </div>
              <span className="text-sm font-medium">Choose Role</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-white">Choose Your Role</h2>
            <p className="text-gray-300 mb-8">Please select your role to get started with zkMed</p>

            <div className="space-y-4 max-w-md mx-auto">
              {/* Patient Option */}
              <button
                onClick={() => handleRoleSelection("PATIENT")}
                className="w-full border-2 border-slate-600 rounded-lg p-6 hover:border-blue-400 hover:bg-slate-700 transition-all text-left group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Patient</h3>
                    <p className="text-gray-300 text-sm">Access your medical records and manage healthcare data</p>
                  </div>
                </div>
              </button>

              {/* Hospital Option */}
              <button
                onClick={() => handleRoleSelection("HOSPITAL")}
                className="w-full border-2 border-slate-600 rounded-lg p-6 hover:border-cyan-400 hover:bg-slate-700 transition-all text-left group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Hospital</h3>
                    <p className="text-gray-300 text-sm">
                      Manage patient records and medical data as a healthcare provider
                    </p>
                  </div>
                </div>
              </button>

              {/* Insurer Option */}
              <button
                onClick={() => handleRoleSelection("INSURER")}
                className="w-full border-2 border-slate-600 rounded-lg p-6 hover:border-blue-400 hover:bg-slate-700 transition-all text-left group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Insurance Company</h3>
                    <p className="text-gray-300 text-sm">Process claims and manage insurance policies</p>
                  </div>
                </div>
              </button>

              {/* Admin Option */}
              <button
                onClick={() => handleRoleSelection("ADMIN")}
                className="w-full border-2 border-slate-600 rounded-lg p-6 hover:border-cyan-400 hover:bg-slate-700 transition-all text-left group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Administrator</h3>
                    <p className="text-gray-300 text-sm">Request administrative access to manage the platform</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
