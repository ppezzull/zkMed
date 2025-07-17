import React from "react";
import { BackgroundPaths } from "~~/components/ui/background-paths";

interface RegisterLayoutProps {
  children: React.ReactNode;
}

/**
 * Registration Layout Component
 *
 * Provides a consistent layout for all registration pages including:
 * - Healthcare-themed styling with dark slate background matching homepage
 * - Animated background paths for visual consistency
 * - Registration information and guidelines
 * - Proper spacing and typography following zkMed design system
 */
export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <BackgroundPaths />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Registration Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">zkMed Registration</h1>
          <p className="text-lg text-gray-300">Secure healthcare registration with blockchain verification</p>
        </div>

        {/* Main Registration Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">{children}</div>
        </div>

        {/* Registration Information Panel */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">Registration Information</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                • <strong className="text-white">Patients:</strong> Registration with email verification
              </p>
              <p>
                • <strong className="text-white">Hospitals:</strong> Domain ownership verification required
              </p>
              <p>
                • <strong className="text-white">Insurance Companies:</strong> Domain ownership verification required
              </p>
              <p>• All registrations use cryptographic MailProof verification</p>
              <p>• Organization registrations require admin approval</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
