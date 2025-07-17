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
      </div>
    </div>
  );
}
