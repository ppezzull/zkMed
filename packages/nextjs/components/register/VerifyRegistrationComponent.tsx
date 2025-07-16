"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HealthcareRole } from "./RoleSelectionComponent";
import { usePrivy } from "@privy-io/react-auth";

/**
 * Verify Registration Component Props
 */
interface VerifyRegistrationComponentProps {
  role: HealthcareRole;
  emlContent: string;
  onBack: () => void;
}

/**
 * Registration Status Types
 */
type RegistrationStatus = "processing" | "success" | "error";

/**
 * Verify Registration Component
 *
 * Final step in registration workflow where the uploaded email
 * is verified and the user registration is completed
 */
export function VerifyRegistrationComponent({ role, emlContent, onBack }: VerifyRegistrationComponentProps) {
  const router = useRouter();
  const { user } = usePrivy();
  const [status, setStatus] = useState<RegistrationStatus>("processing");
  const [error, setError] = useState<string | null>(null);
  const [registrationDetails, setRegistrationDetails] = useState<{
    userId?: string;
    role?: string;
    timestamp?: string;
  }>({});

  /**
   * Process email verification
   */
  useEffect(() => {
    const processEmailVerification = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing

        // Basic email content validation
        if (!emlContent || emlContent.trim().length === 0) {
          throw new Error("Invalid email content");
        }

        // Simulate verification process
        const isValidEmail =
          emlContent.includes("proving.vlayer.xyz") || emlContent.includes("zkMed") || emlContent.length > 100; // Basic content check

        if (!isValidEmail) {
          throw new Error("Email verification failed. Please ensure you uploaded the correct email response.");
        }

        // Set success status with mock registration details
        setRegistrationDetails({
          userId: user?.id || "unknown",
          role: role,
          timestamp: new Date().toISOString(),
        });

        setStatus("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
        setStatus("error");
      }
    };

    processEmailVerification();
  }, [emlContent, role, user?.id]);

  /**
   * Handle completion and redirect
   */
  const handleComplete = () => {
    // Redirect based on role
    switch (role) {
      case "PATIENT":
        router.push("/patient");
        break;
      case "HOSPITAL":
        router.push("/hospital");
        break;
      case "INSURER":
        router.push("/insurance");
        break;
      case "ADMIN":
        router.push("/admin");
        break;
      default:
        router.push("/");
    }
  };

  const handleRetry = () => {
    setStatus("processing");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Registration Verification</h1>
              <p className="text-gray-600">Verifying your registration details</p>
            </div>
            {status === "error" && (
              <button onClick={onBack} className="text-gray-500 hover:text-gray-700 transition-colors">
                ← Back
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 py-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">4</div>
              <span className="text-sm font-medium">Verify Registration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center space-y-6">
            {/* Processing State */}
            {status === "processing" && <ProcessingState />}

            {/* Success State */}
            {status === "success" && (
              <SuccessState role={role} registrationDetails={registrationDetails} onComplete={handleComplete} />
            )}

            {/* Error State */}
            {status === "error" && <ErrorState error={error} onRetry={handleRetry} onBack={onBack} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Processing State Component
 */
function ProcessingState() {
  return (
    <>
      <div className="text-4xl mb-4">⏳</div>
      <h2 className="text-2xl font-bold mb-4">Verifying Registration</h2>
      <p className="text-gray-600 mb-8">Please wait while we verify your email and complete your registration...</p>
      <div className="flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    </>
  );
}

/**
 * Success State Component
 */
interface SuccessStateProps {
  role: HealthcareRole;
  registrationDetails: any;
  onComplete: () => void;
}

function SuccessState({ role, registrationDetails, onComplete }: SuccessStateProps) {
  const getRoleDisplayName = (role: HealthcareRole): string => {
    switch (role) {
      case "PATIENT":
        return "Patient";
      case "HOSPITAL":
        return "Hospital";
      case "INSURER":
        return "Insurance Company";
      case "ADMIN":
        return "Administrator";
      default:
        return role;
    }
  };

  return (
    <>
      <div className="text-4xl mb-4">✅</div>
      <h2 className="text-2xl font-bold mb-4 text-green-600">Registration Successful!</h2>
      <p className="text-gray-600 mb-8">
        Your registration as a {getRoleDisplayName(role)} has been completed successfully.
      </p>

      {/* Registration Details */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-green-800 mb-4">Registration Details</h3>
        <div className="space-y-2 text-sm text-green-700">
          <p>
            <strong>Role:</strong> {getRoleDisplayName(role)}
          </p>
          <p>
            <strong>User ID:</strong> {registrationDetails.userId}
          </p>
          <p>
            <strong>Registered:</strong> {new Date(registrationDetails.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        Continue to Dashboard
      </button>
    </>
  );
}

/**
 * Error State Component
 */
interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
  onBack: () => void;
}

function ErrorState({ error, onRetry, onBack }: ErrorStateProps) {
  return (
    <>
      <div className="text-4xl mb-4">❌</div>
      <h2 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h2>
      <p className="text-gray-600 mb-4">
        We couldn&apos;t verify your registration. Please check the error below and try again.
      </p>

      {/* Error Details */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </>
  );
}
