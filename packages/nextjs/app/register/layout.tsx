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
    <main className="bg-slate-900">
      <div className="absolute inset-0">
        <BackgroundPaths />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </main>
  );
}
