"use client";

import React from "react";

interface OrganizationDetailsComponentProps {
  organizationType: "HOSPITAL" | "INSURER";
  organizationName: string;
  setOrganizationName: (name: string) => void;
  onSubmit: (name: string) => void;
  onBack: () => void;
}

/**
 * Organization Details Component
 *
 * Collects organization name for hospital and insurance company registration
 */
export function OrganizationDetailsComponent({
  organizationType,
  organizationName,
  setOrganizationName,
  onSubmit,
  onBack,
}: OrganizationDetailsComponentProps) {
  const handleSubmit = () => {
    if (organizationName.trim()) {
      onSubmit(organizationName.trim());
    }
  };

  return (
    <div className="min-h-screen">
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

            <div className="w-8 h-0.5 bg-slate-600"></div>

            <div className="flex items-center space-x-2 text-cyan-300">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                2
              </div>
              <span className="text-sm font-medium">Organization Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-8">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">
              {organizationType === "HOSPITAL" ? "Hospital Registration" : "Insurance Company Registration"}
            </h2>
            <p className="text-gray-300 mb-6">Enter your organization name to begin the verification process:</p>

            <div className="mb-6 text-left">
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-300 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                id="organizationName"
                value={organizationName}
                onChange={e => setOrganizationName(e.target.value)}
                placeholder={
                  organizationType === "HOSPITAL" ? "e.g., City General Hospital" : "e.g., HealthCare Insurance Group"
                }
                className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700 text-white placeholder:text-gray-400"
                onKeyPress={e => {
                  if (e.key === "Enter" && organizationName.trim()) {
                    handleSubmit();
                  }
                }}
              />
              <p className="text-xs text-gray-400 mt-1">
                This name will be verified through your organization&apos;s email domain
              </p>
            </div>

            <div className="flex justify-between">
              <button onClick={onBack} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                Back
              </button>

              <button
                onClick={handleSubmit}
                disabled={!organizationName.trim()}
                className={`px-6 py-2 rounded-lg transition-all transform hover:scale-105 ${
                  organizationName.trim()
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg"
                    : "bg-slate-600 text-gray-400 cursor-not-allowed"
                }`}
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
