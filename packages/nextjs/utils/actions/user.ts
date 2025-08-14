"use server";

import { serverContractRead } from "~~/lib/serverUtils/contractRead";
import { AdminRole, UserType, type UserVerificationData } from "~~/types/healthcare";

export async function getOnchainRole(address: string) {
  try {
    const { data } = await serverContractRead({
      contractName: "zkMedCore",
      functionName: "getRole",
      args: [address as `0x${string}`],
    });
    return data;
  } catch (err) {
    console.error("getOnchainRole error", err);
    return null;
  }
}

export async function getUserVerificationData(address: string): Promise<UserVerificationData | null> {
  try {
    const { data } = await serverContractRead({
      contractName: "zkMedCore",
      functionName: "getRole",
      args: [address as `0x${string}`],
    });

    const role = (data as any)?.[0] as string | undefined;
    const isActive = Boolean((data as any)?.[1]);

    let userType: UserType | null = null;
    if (role === "PATIENT") userType = UserType.PATIENT;
    else if (role === "HOSPITAL") userType = UserType.HOSPITAL;
    else if (role === "INSURER") userType = UserType.INSURER;

    const result: UserVerificationData = {
      userType,
      isActive,
      isAdmin: role === "ADMIN",
      adminRole: role === "ADMIN" ? AdminRole.BASIC : undefined,
    };

    return result;
  } catch (err) {
    console.error("getUserVerificationData error", err);
    return null;
  }
}
