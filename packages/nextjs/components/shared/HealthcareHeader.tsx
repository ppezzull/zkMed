"use client";

import Link from "next/link";
import { HealthcareLogo } from "./HealthcareLogo";
import { ProductDropdown } from "./ProductDropdown";
import { HeaderConnectButton } from "~~/components/PrivyConnector";
import { cn } from "~~/lib/utils";

interface HealthcareHeaderProps {
  className?: string;
}

export const HealthcareHeader = ({ className }: HealthcareHeaderProps) => {
  return (
    <header className={cn("absolute top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <HealthcareLogo size="md" />
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <ProductDropdown />
            <Link
              href="/blockexplorer"
              className={cn(
                "px-4 py-2 text-sm font-medium",
                "text-gray-300 hover:text-white transition-colors duration-200",
              )}
            >
              Explore
            </Link>
          </nav>

          {/* Right: Wallet Connection */}
          <div className="flex items-center">
            <HeaderConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <HeaderConnectButton />
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden pb-4">
          <nav className="flex flex-col space-y-2">
            <div className="px-4">
              <ProductDropdown />
            </div>
            <Link
              href="/explore"
              className={cn(
                "block px-4 py-2 text-sm font-medium",
                "text-gray-300 hover:text-white transition-colors duration-200",
              )}
            >
              Explore
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
