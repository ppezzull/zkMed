import React, { Suspense } from "react";
import { RoleSelectionComponent } from "~~/components/register/RoleSelectionComponent";

/**
 * Role Selection Page
 *
 * First step in the registration workflow where users choose their
 * role (Patient, Hospital, Insurance Company, or Administrator)
 */
export default function RoleSelectionPage() {
  return (
    <Suspense fallback={<RoleSelectionLoadingState />}>
      <RoleSelectionComponent />
    </Suspense>
  );
}

/**
 * Loading state component for role selection page
 */
function RoleSelectionLoadingState() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-cyan-400 rounded-full border-t-transparent"></div>
    </div>
  );
}
