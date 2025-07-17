"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HealthcareRole } from "./RoleSelectionComponent";
import { PartyPopper, X, Zap } from "lucide-react";
import { useProver } from "~~/hooks/zkMed/useProver";
import { useVerifier } from "~~/hooks/zkMed/useVerifier";

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
  const [isComplete, setIsComplete] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);

  // Use real hooks
  const {
    generatePatientProof,
    generateOrganizationProof,
    proof,
    currentStep,
    error: proverError,
    isLoading: isGeneratingProof,
  } = useProver();

  const {
    verifyPatientProof,
    verifyOrganizationProof,
    verificationStep,
    error: verifierError,
    isVerifying,
    lastVerificationResult,
  } = useVerifier();

  // Combined error and step tracking
  const error = proverError || verifierError;
  const currentStepDisplay = currentStep || verificationStep || "Ready";

  const handleProofGeneration = useCallback(async () => {
    try {
      if (role === "PATIENT") {
        await generatePatientProof(emlContent);
      } else {
        await generateOrganizationProof(emlContent);
      }
      setProofGenerated(true);
    } catch (error: any) {
      console.error("Proof generation failed:", error);
    }
  }, [role, emlContent, generatePatientProof, generateOrganizationProof]);

  const handleProofVerification = useCallback(async () => {
    try {
      if (role === "PATIENT") {
        await verifyPatientProof(proof);
      } else {
        await verifyOrganizationProof(proof);
      }
    } catch (error: any) {
      console.error("Proof verification failed:", error);
    }
  }, [role, proof, verifyPatientProof, verifyOrganizationProof]);

  useEffect(() => {
    if (emlContent && !proofGenerated && !isGeneratingProof && !proof) {
      handleProofGeneration();
    }
  }, [emlContent, proofGenerated, isGeneratingProof, proof, handleProofGeneration]);

  // Handle proof verification when proof is generated
  useEffect(() => {
    if (proof && proofGenerated && !isVerifying && !lastVerificationResult) {
      handleProofVerification();
    }
  }, [proof, proofGenerated, isVerifying, lastVerificationResult, handleProofVerification]);

  // Handle completion when verification is done
  useEffect(() => {
    if (lastVerificationResult && !error) {
      setIsComplete(true);
    }
  }, [lastVerificationResult, error]);

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
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Join zkMed</h1>
              <p className="text-gray-300">Complete your registration to access healthcare services</p>
            </div>
            {!isComplete && (
              <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
                ← Back
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 py-4">
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
                ✓
              </div>
              <span className="text-sm font-medium">Waiting for Email</span>
            </div>

            <div className="w-8 h-0.5 bg-slate-600"></div>

            <div
              className={`flex items-center space-x-2 ${isComplete ? "text-cyan-300" : error ? "text-red-400" : "text-cyan-300"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isComplete ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" : error ? "bg-red-500 text-white" : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"}`}
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
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-8">
          <div className="text-center">
            {/* Success State */}
            {isComplete && (
              <div>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 border border-green-500 rounded-xl flex items-center justify-center">
                    <PartyPopper className="w-7 h-7 text-green-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">Registration Complete!</h2>
                <p className="text-gray-300 mb-6">Your registration has been successfully submitted and verified.</p>
                <p className="text-sm text-gray-400 mb-8">
                  {role === "PATIENT"
                    ? "You can now access your patient dashboard and manage your medical records."
                    : role === "ADMIN"
                      ? "Your admin request has been submitted for review."
                      : "Your organization registration is pending admin approval."}
                </p>
                <button
                  onClick={handleContinue}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Continue to Dashboard
                </button>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 border border-red-500 rounded-xl flex items-center justify-center">
                    <X className="w-7 h-7 text-red-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-red-400 mb-4">Verification Failed</h2>
                <p className="text-gray-300 mb-4">
                  We couldn&apos;t verify your registration. Please check the error below and try again.
                </p>
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
                <div className="flex justify-center space-x-4">
                  <button onClick={onBack} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setProofGenerated(false);
                      setIsComplete(false);
                      // Reset hooks will happen automatically when component re-runs the effects
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
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 border border-slate-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-7 h-7 text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">Verifying Registration</h2>
                <p className="text-gray-300 mb-6">
                  We&apos;re processing your email verification and generating cryptographic proofs.
                </p>

                <div className="mb-6">
                  <div className="animate-pulse bg-slate-700 border border-slate-600 rounded-lg p-4">
                    <p className="text-cyan-300 font-medium">{currentStepDisplay}</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-slate-700 border border-slate-600 rounded-lg max-w-2xl mx-auto">
                  <h3 className="font-semibold text-cyan-300 mb-2">Processing Steps:</h3>
                  <ul className="text-sm text-gray-300 space-y-1 text-left">
                    <li className={currentStepDisplay.includes("Preparing") ? "font-bold text-cyan-300" : ""}>
                      • Preparing email verification
                    </li>
                    <li className={currentStepDisplay.includes("Preverifying") ? "font-bold text-cyan-300" : ""}>
                      • Preverifying email authenticity
                    </li>
                    <li className={currentStepDisplay.includes("Generating") ? "font-bold text-cyan-300" : ""}>
                      • Generating cryptographic proof
                    </li>
                    <li className={currentStepDisplay.includes("Waiting") ? "font-bold text-cyan-300" : ""}>
                      • Waiting for proof result
                    </li>
                    <li className={currentStepDisplay.includes("Verifying") ? "font-bold text-cyan-300" : ""}>
                      • Verifying proof on blockchain
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center mt-8">
                  <button onClick={onBack} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
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
