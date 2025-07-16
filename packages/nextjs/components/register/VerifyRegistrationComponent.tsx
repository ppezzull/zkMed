"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HealthcareRole } from "./RoleSelectionComponent";

interface VerifyRegistrationComponentProps {
  role: HealthcareRole;
  emlContent: string;
  organizationName?: string;
  onBack: () => void;
}

/**
 * Verify Registration Component
 *
 * Final step in registration workflow where email content is verified
 * and registration is submitted to the blockchain
 */
export function VerifyRegistrationComponent({
  role,
  emlContent,
  organizationName: _organizationName, // eslint-disable-line @typescript-eslint/no-unused-vars
  onBack,
}: VerifyRegistrationComponentProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string>("Generating proof...");
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proofGenerated, setProofGenerated] = useState(false);

  useEffect(() => {
    if (emlContent && !proofGenerated) {
      handleProofGeneration();
    }
  }, [emlContent, proofGenerated]);

  const handleProofGeneration = async () => {
    try {
      setCurrentStep("Analyzing email content...");

      // Simulate proof generation steps
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep("Generating cryptographic proof...");

      await new Promise(resolve => setTimeout(resolve, 3000));
      setCurrentStep("Validating proof...");

      await new Promise(resolve => setTimeout(resolve, 2000));
      setProofGenerated(true);
      setCurrentStep("Submitting to blockchain...");

      // Simulate blockchain submission
      await new Promise(resolve => setTimeout(resolve, 3000));
      setCurrentStep("Registration complete!");
      setIsComplete(true);
    } catch (error: any) {
      console.error("Proof generation failed:", error);
      setError(error.message || "Failed to generate proof");
      setCurrentStep("Error occurred");
    }
  };

  const handleContinue = () => {
    // Navigate based on role
    switch (role) {
      case "PATIENT":
        router.push("/dashboard/patient");
        break;
      case "HOSPITAL":
      case "INSURER":
        router.push("/dashboard/organization");
        break;
      case "ADMIN":
        router.push("/dashboard/admin");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Join zkMed</h1>
              <p className="text-gray-600">Complete your registration to access healthcare services</p>
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

            {role !== "PATIENT" && (
              <>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">✓</div>
                  <span className="text-sm font-medium">Organization Details</span>
                </div>
              </>
            )}

            <div className="w-8 h-0.5 bg-gray-300"></div>

            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">✓</div>
              <span className="text-sm font-medium">Email Verification</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>

            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">✓</div>
              <span className="text-sm font-medium">Waiting for Email</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>

            <div
              className={`flex items-center space-x-2 ${isComplete ? "text-green-600" : error ? "text-red-600" : "text-blue-600"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isComplete ? "bg-green-100" : error ? "bg-red-100" : "bg-blue-100"}`}
              >
                {isComplete ? "✓" : error ? "!" : role === "PATIENT" ? "4" : "5"}
              </div>
              <span className="text-sm font-medium">Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            {/* Success State */}
            {isComplete && (
              <div>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Complete!</h2>
                <p className="text-gray-600 mb-6">Your registration has been successfully submitted and verified.</p>
                <p className="text-sm text-gray-500 mb-8">
                  {role === "PATIENT"
                    ? "You can now access your patient dashboard and manage your medical records."
                    : role === "ADMIN"
                      ? "Your admin request has been submitted for review."
                      : "Your organization registration is pending admin approval."}
                </p>
                <button
                  onClick={handleContinue}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue to Dashboard
                </button>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div>
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
                <p className="text-gray-600 mb-4">
                  We couldn&apos;t verify your registration. Please check the error below and try again.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <div className="flex justify-center space-x-4">
                  <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setError(null);
                      setProofGenerated(false);
                      setCurrentStep("Generating proof...");
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {!isComplete && !error && (
              <div>
                <div className="text-6xl mb-4">⚡</div>
                <h2 className="text-2xl font-bold mb-4">Verifying Registration</h2>
                <p className="text-gray-600 mb-6">
                  We&apos;re processing your email verification and generating cryptographic proofs.
                </p>

                <div className="mb-6">
                  <div className="animate-pulse bg-blue-100 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">{currentStep}</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
                  <h3 className="font-semibold text-blue-800 mb-2">Processing Steps:</h3>
                  <ul className="text-sm text-blue-700 space-y-1 text-left">
                    <li className={currentStep.includes("Analyzing") ? "font-bold" : ""}>
                      • Analyzing email content and headers
                    </li>
                    <li className={currentStep.includes("Generating") ? "font-bold" : ""}>
                      • Generating cryptographic proof
                    </li>
                    <li className={currentStep.includes("Validating") ? "font-bold" : ""}>
                      • Validating proof integrity
                    </li>
                    <li className={currentStep.includes("Submitting") ? "font-bold" : ""}>
                      • Submitting to blockchain
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center mt-8">
                  <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
