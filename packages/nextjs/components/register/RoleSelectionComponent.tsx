"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

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
 * Allows users to choose their role in the healthcare ecosystem:
 * - Patient: Access medical records and manage healthcare data
 * - Hospital: Manage patient records as healthcare provider
 * - Insurance Company: Process claims and manage policies
 * - Administrator: Request admin access to manage platform
 */
export function RoleSelectionComponent({ onRoleSelect }: RoleSelectionProps) {
  const router = useRouter();
  const { authenticated, user } = usePrivy();

  const handleRoleSelection = (role: HealthcareRole) => {
    if (onRoleSelect) {
      onRoleSelect(role);
      return;
    }

    // Navigation logic based on selected role
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

  const handleBackToHome = () => {
    router.push("/");
  };

  // Require wallet connection for registration
  if (!authenticated || !user) {
    return <WalletConnectionRequired />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <RegistrationHeader onBack={handleBackToHome} />

      {/* Progress Indicator */}
      <RegistrationProgress currentStep={1} />

      {/* Role Selection Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Choose Your Role</h2>
            <p className="text-gray-600 mb-8">Please select your role to get started with zkMed</p>

            <div className="space-y-4 max-w-md mx-auto">
              <RoleOptionCard
                role="PATIENT"
                title="Patient"
                icon="👤"
                description="Access your medical records and manage healthcare data"
                colorTheme="blue"
                onClick={() => handleRoleSelection("PATIENT")}
              />

              <RoleOptionCard
                role="HOSPITAL"
                title="Hospital"
                icon="🏥"
                description="Manage patient records and medical data as a healthcare provider"
                colorTheme="green"
                onClick={() => handleRoleSelection("HOSPITAL")}
              />

              <RoleOptionCard
                role="INSURER"
                title="Insurance Company"
                icon="🛡️"
                description="Process claims and manage insurance policies"
                colorTheme="purple"
                onClick={() => handleRoleSelection("INSURER")}
              />

              <RoleOptionCard
                role="ADMIN"
                title="Administrator"
                icon="👑"
                description="Request administrative access to manage the platform"
                colorTheme="orange"
                onClick={() => handleRoleSelection("ADMIN")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Registration Header Component
 *
 * Displays the registration title and back navigation
 */
interface RegistrationHeaderProps {
  onBack: () => void;
}

function RegistrationHeader({ onBack }: RegistrationHeaderProps) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Join zkMed</h1>
            <p className="text-gray-600">Complete your registration to access healthcare services</p>
          </div>
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700 transition-colors">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Registration Progress Component
 *
 * Shows current step in the registration process
 */
interface RegistrationProgressProps {
  currentStep: number;
}

function RegistrationProgress({ currentStep }: RegistrationProgressProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center space-x-4 py-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">{currentStep}</div>
            <span className="text-sm font-medium">Choose Role</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Role Option Card Component
 *
 * Individual role selection card with hover effects
 */
interface RoleOptionCardProps {
  role: HealthcareRole;
  title: string;
  icon: string;
  description: string;
  colorTheme: "blue" | "green" | "purple" | "orange";
  onClick: () => void;
}

function RoleOptionCard({ title, icon, description, colorTheme, onClick }: RoleOptionCardProps) {
  const colorClasses = {
    blue: "hover:border-blue-500 hover:bg-blue-50 bg-blue-100",
    green: "hover:border-green-500 hover:bg-green-50 bg-green-100",
    purple: "hover:border-purple-500 hover:bg-purple-50 bg-purple-100",
    orange: "hover:border-orange-500 hover:bg-orange-50 bg-orange-100",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full border-2 border-gray-200 rounded-lg p-6 ${colorClasses[colorTheme]} transition-all text-left`}
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 ${colorClasses[colorTheme]} rounded-full flex items-center justify-center mr-4`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </button>
  );
}

/**
 * Wallet Connection Required Component
 *
 * Displayed when user hasn't connected their wallet
 */
function WalletConnectionRequired() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 mb-4">Connect your wallet to continue</div>
        <p className="text-gray-600">You need to connect your wallet to start the registration process</p>
      </div>
    </div>
  );
}
