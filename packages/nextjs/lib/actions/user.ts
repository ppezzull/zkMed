"use server";

import { mockGetUserVerificationData } from "~~/lib/mock-data";
import { UserType, UserVerificationData } from "~~/types/healthcare";

// ======== User Verification Functions ========

export async function getUserVerificationData(address: string): Promise<UserVerificationData | null> {
  try {
    // Use mock data instead of actual contract calls
    const verification = await mockGetUserVerificationData(address);
    return verification;
  } catch (error) {
    console.error("Error fetching user verification data:", error);
    return {
      userType: null,
      isActive: false,
      isAdmin: false,
      adminRole: undefined,
      permissions: undefined,
      domain: undefined,
      organizationName: undefined,
    };
  }
}

export async function isUserRegistered(address: string): Promise<boolean> {
  try {
    const verification = await getUserVerificationData(address);
    return verification?.isActive || false;
  } catch (error) {
    console.error("Error checking if user is registered:", error);
    return false;
  }
}

export async function getUserType(address: string): Promise<UserType | null> {
  try {
    const verification = await getUserVerificationData(address);
    return verification?.userType || null;
  } catch (error) {
    console.error("Error fetching user type:", error);
    return null;
  }
}
