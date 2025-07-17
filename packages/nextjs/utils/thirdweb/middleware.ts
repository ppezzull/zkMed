// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
import { AdminRole, UserType } from "~~/types/healthcare";

// Define protected routes and their requirements
export const protectedRoutes = {
  "/admin": { requireAdmin: true, minRole: AdminRole.BASIC },
  "/admin/super": { requireAdmin: true, minRole: AdminRole.SUPER_ADMIN },
  "/admin/moderate": { requireAdmin: true, minRole: AdminRole.MODERATOR },
  "/patient": { requireUserType: UserType.PATIENT },
  "/hospital": { requireUserType: UserType.HOSPITAL },
  "/insurance": { requireUserType: UserType.INSURER },
  "/register": { requireWallet: true, blockRegistered: true }, // Block registered users from accessing registration
} as const;

export type RouteConfig = {
  requireAdmin?: boolean;
  minRole?: AdminRole;
  requireUserType?: UserType;
  requireWallet?: boolean;
  blockRegistered?: boolean;
};

export function getUserDashboardPath(userType: UserType | null, isAdmin: boolean, walletAddress?: string): string {
  if (isAdmin) {
    return "/admin";
  }

  // Use provided wallet address or fall back to generic paths
  const addressPart = walletAddress || "[address]";

  switch (userType) {
    case UserType.PATIENT:
      return `/patient/${addressPart}`;
    case UserType.HOSPITAL:
      return `/hospital/${addressPart}`;
    case UserType.INSURER:
      return `/insurance/${addressPart}`;
    default:
      return "/"; // Fallback for null or unknown user types
  }
}

export function getUserTypeName(userType: UserType): string {
  switch (userType) {
    case UserType.PATIENT:
      return "Patient";
    case UserType.HOSPITAL:
      return "Hospital";
    case UserType.INSURER:
      return "Insurance Company";
    default:
      return "Unknown";
  }
}

export function getAdminRoleName(role: AdminRole): string {
  switch (role) {
    case AdminRole.BASIC:
      return "Basic Admin";
    case AdminRole.MODERATOR:
      return "Moderator";
    case AdminRole.SUPER_ADMIN:
      return "Super Admin";
    default:
      return "Unknown Role";
  }
}

// Mock function for checking user registration status
export async function checkUserRegistrationStatus(walletAddress: string) {
  try {
    // Mock implementation - in a real app this would call getUserVerificationData
    const mockUserVerification = {
      isActive: true,
      userType: UserType.PATIENT,
      isAdmin: false,
    };

    return {
      isRegistered: mockUserVerification?.isActive || false,
      userType: mockUserVerification?.userType || null,
      isAdmin: mockUserVerification?.isAdmin || false,
      dashboardPath: mockUserVerification?.isActive
        ? getUserDashboardPath(mockUserVerification.userType, mockUserVerification.isAdmin, walletAddress)
        : null,
    };
  } catch (error) {
    console.error("Error checking user registration status:", error);
    return {
      isRegistered: false,
      userType: null,
      isAdmin: false,
      dashboardPath: null,
    };
  }
}
