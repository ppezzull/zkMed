"use client";

import { cn } from "~~/lib/utils";

interface HealthcareLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const HealthcareLogo = ({ size = "md", className }: HealthcareLogoProps) => {
  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-xl font-bold",
    lg: "text-2xl font-bold",
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative">
        {/* Medical Cross Icon */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <div className="w-4 h-1 bg-white absolute"></div>
          <div className="w-1 h-4 bg-white absolute"></div>
        </div>
        {/* Shield overlay for security */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <span className={cn(sizeClasses[size], "text-white")}>zkMed</span>
    </div>
  );
};
