"use server";

import { ethers } from "ethers";
import { RegistrationContractABI } from "@/contracts/RegistrationContract";
import { REGISTRATION_CONTRACT } from "@/contracts/addresses";

// Create provider and contract instance
function getContract() {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545");
  return new ethers.Contract(REGISTRATION_CONTRACT, RegistrationContractABI, provider);
}

export async function checkUserRegistration(address: string) {
  try {
    const contract = getContract();
    const [role, verified, active] = await contract.getUserRegistration(address);
    
    return {
      isRegistered: role !== 0, // Role.None = 0
      role: role,
      verified: verified,
      active: active,
    };
  } catch (error) {
    console.error("Error checking user registration:", error);
    throw new Error("Failed to check user registration status");
  }
}

export async function registerPatient(patientAddress: string, commitment: string) {
  try {
    // This would need to be called with a signed transaction from the frontend
    // For now, we'll just return the function signature that needs to be called
    return {
      functionName: "registerPatient",
      args: [commitment],
      address: REGISTRATION_CONTRACT,
      abi: RegistrationContractABI,
    };
  } catch (error) {
    console.error("Error preparing patient registration:", error);
    throw new Error("Failed to prepare patient registration");
  }
}

export async function registerOrganization(
  organizationAddress: string, 
  proof: any, 
  orgData: any, 
  role: number
) {
  try {
    // This would need to be called with a signed transaction from the frontend
    return {
      functionName: "registerOrganization",
      args: [proof, orgData, role],
      address: REGISTRATION_CONTRACT,
      abi: RegistrationContractABI,
    };
  } catch (error) {
    console.error("Error preparing organization registration:", error);
    throw new Error("Failed to prepare organization registration");
  }
}

export async function getUserRole(address: string): Promise<number> {
  try {
    const contract = getContract();
    const role = await contract.roles(address);
    return Number(role);
  } catch (error) {
    console.error("Error getting user role:", error);
    return 0; // Role.None
  }
}

export async function isUserVerified(address: string): Promise<boolean> {
  try {
    const contract = getContract();
    const verified = await contract.verified(address);
    return verified;
  } catch (error) {
    console.error("Error checking user verification:", error);
    return false;
  }
}

// Role enum mapping
