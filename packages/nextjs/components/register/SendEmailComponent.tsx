"use client";

import React, { useState } from "react";
import type { HealthcareRole } from "./RoleSelectionComponent";
import { usePrivy } from "@privy-io/react-auth";
import { v4 as uuidv4 } from "uuid";

/**
 * Input with Copy Button Component
 *
 * Reusable input field with copy-to-clipboard functionality
 */
interface InputWithCopyProps {
  label: string;
  value: string;
}

function InputWithCopy({ label, value }: InputWithCopyProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div className="text-left">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}:</label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={value}
          readOnly
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
        />
        <button
          onClick={handleCopy}
          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

/**
 * Send Email Component Props
 */
interface SendEmailComponentProps {
  role: HealthcareRole;
  organizationName?: string;
  onEmailSent: (emailId: string) => void;
  onBack: () => void;
}

/**
 * Send Email Component
 *
 * First step in registration workflow where users send verification email
 * to the zkMed proving system for cryptographic verification
 */
export function SendEmailComponent({ role, organizationName, onEmailSent, onBack }: SendEmailComponentProps) {
  const { user } = usePrivy();
  const [emailId] = useState(() => uuidv4());

  const uniqueEmail = `${emailId}@proving.vlayer.xyz`;

  /**
   * Generate email subject based on role and verification requirements
   */
  const generateEmailSubject = (): string => {
    if (!user?.wallet?.address) return "";

    switch (role) {
      case "PATIENT":
        return `zkMed Patient Registration - Verify ${user.wallet.address}`;
      case "HOSPITAL":
        return `zkMed Hospital Registration - Verify ${user.wallet.address} for ${organizationName || "Organization"}`;
      case "INSURER":
        return `zkMed Insurance Registration - Verify ${user.wallet.address} for ${organizationName || "Organization"}`;
      case "ADMIN":
        return `zkMed Admin Request - Verify ${user.wallet.address}`;
      default:
        return "";
    }
  };

  /**
   * Generate email body with role-specific instructions
   */
  const generateEmailBody = (): string => {
    const walletAddress = user?.wallet?.address || "";

    const baseMessage = `
I am requesting registration for zkMed platform.

Wallet Address: ${walletAddress}
Role: ${role}
${organizationName ? `Organization: ${organizationName}` : ""}
Registration ID: ${emailId}

Please verify this registration request.
    `.trim();

    return baseMessage;
  };

  const handleContinue = () => {
    onEmailSent(emailId);
  };

  const emailSubject = generateEmailSubject();
  const emailBody = generateEmailBody();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Verification</h1>
              <p className="text-gray-600">Send verification email to prove your identity</p>
            </div>
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 transition-colors">
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 py-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">2</div>
              <span className="text-sm font-medium">Send Email</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Send Verification Email</h2>
              <p className="text-gray-600 mb-8">
                Copy the information below and send an email to begin the verification process
              </p>
            </div>

            <div className="space-y-4">
              <InputWithCopy label="Send To" value={uniqueEmail} />

              <InputWithCopy label="Subject" value={emailSubject} />

              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Body:</label>
                <div className="flex items-start space-x-2">
                  <textarea
                    value={emailBody}
                    readOnly
                    rows={8}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 resize-none"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(emailBody)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Copy the email address, subject, and message body above</li>
                <li>Open your email client and compose a new email</li>
                <li>Paste the information and send the email</li>
                <li>Click &quot;Continue&quot; below once you&apos;ve sent the email</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
