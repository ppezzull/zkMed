"use client";

import React, { useState } from "react";
import type { HealthcareRole } from "./RoleSelectionComponent";
import { usePrivy } from "@privy-io/react-auth";
import { v4 as uuidv4 } from "uuid";

interface InputWithCopyProps {
  label: string;
  value: string;
}

const InputWithCopy = ({ label, value }: InputWithCopyProps) => (
  <div className="text-left">
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}:</label>
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={value}
        readOnly
        className="flex-1 px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white"
      />
      <button
        onClick={() => navigator.clipboard.writeText(value)}
        className="px-3 py-2 bg-slate-600 text-gray-300 rounded-lg hover:bg-slate-500 hover:text-white transition-colors text-sm"
      >
        Copy
      </button>
    </div>
  </div>
);

interface SendEmailComponentProps {
  role: HealthcareRole;
  organizationName?: string;
  onEmailSent: (emailId: string) => void;
  onBack: () => void;
}

export function SendEmailComponent({ role, organizationName, onEmailSent, onBack }: SendEmailComponentProps) {
  const { user } = usePrivy();
  const [emailId] = useState(() => uuidv4());

  const uniqueEmail = `${emailId}@proving.vlayer.xyz`;

  // Generate subject based on role and contract requirements
  const getSubject = () => {
    if (!user?.wallet?.address) return "";

    switch (role) {
      case "PATIENT":
        return `Register patient with wallet: ${user.wallet.address}`;
      case "HOSPITAL":
      case "INSURER":
        if (!organizationName) return "";
        return `Register organization ${organizationName} as ${role} with wallet: ${user.wallet.address}`;
      case "ADMIN":
        return `Register admin with wallet: ${user.wallet.address}`;
      default:
        return "";
    }
  };

  // Generate email body template
  const getEmailBody = () => {
    switch (role) {
      case "PATIENT":
        return `Hello zkMed Team,

I am requesting to register as a patient on the zkMed platform.

Wallet Address: ${user?.wallet?.address}
Role: Patient
Registration ID: ${emailId}

Please process my registration.

Best regards`;
      case "HOSPITAL":
        return `Hello zkMed Team,

I am requesting to register our hospital organization on the zkMed platform.

Organization: ${organizationName}
Wallet Address: ${user?.wallet?.address}
Role: Hospital
Registration ID: ${emailId}

Please process our organization registration.

Best regards`;
      case "INSURER":
        return `Hello zkMed Team,

I am requesting to register our insurance company on the zkMed platform.

Organization: ${organizationName}
Wallet Address: ${user?.wallet?.address}
Role: Insurance Company
Registration ID: ${emailId}

Please process our organization registration.

Best regards`;
      case "ADMIN":
        return `Hello zkMed Team,

I am requesting administrative access to the zkMed platform.

Wallet Address: ${user?.wallet?.address}
Role: Administrator
Registration ID: ${emailId}

Please review my admin access request.

Best regards`;
      default:
        return "";
    }
  };

  const subject = getSubject();
  const emailBody = getEmailBody();

  const handleEmailSent = () => {
    onEmailSent(emailId);
  };

  if (!user?.wallet?.address) {
    return <div className="text-white">Connect your wallet to continue</div>;
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
            <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
              ← Back
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
                {role === "PATIENT" ? "2" : "3"}
              </div>
              <span className="text-sm font-medium">Email Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-white">Send Verification Email</h2>
            <p className="text-gray-300 mb-6">
              {role === "PATIENT"
                ? "Send an email from your personal email address to verify your identity."
                : "Send an email from your organization's official email address to verify domain ownership."}
            </p>

            <div className="space-y-4 max-w-2xl mx-auto">
              <InputWithCopy label="To" value={uniqueEmail} />
              <InputWithCopy label="Subject" value={subject} />
              <InputWithCopy label="Body" value={emailBody} />
            </div>

            <div className="mt-8 p-4 bg-slate-700 border border-slate-600 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-semibold text-cyan-300 mb-2">Important:</h3>
              <ul className="text-sm text-gray-300 space-y-1 text-left">
                {role === "PATIENT" ? (
                  <>
                    <li>• Send this email from your personal email address</li>
                    <li>• Keep the subject line exactly as shown</li>
                    <li>• The email body can be customized as needed</li>
                  </>
                ) : (
                  <>
                    <li>• Send this email from your organization&apos;s official email domain</li>
                    <li>• The email domain will be used to verify your organization</li>
                    <li>• Keep the subject line exactly as shown</li>
                    <li>• The email body can be customized as needed</li>
                  </>
                )}
              </ul>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={onBack} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                Back
              </button>

              <button
                onClick={handleEmailSent}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
              >
                I&apos;ve Sent the Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
