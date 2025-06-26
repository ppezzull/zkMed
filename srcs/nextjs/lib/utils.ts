import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getContract } from "thirdweb";
import { client } from "@/utils/thirdweb/client";
import { mantleFork } from "@/lib/configs/chain-config";
import { HealthcareRegistration__factory } from "@/utils/types/HealthcareRegistration/factories/HealthcareRegistration__factory";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get the healthcare contract instance
export const getHealthcareContract = () => {
  const contractAddress = process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS;
  if (!contractAddress) {
    throw new Error("Healthcare contract address not configured");
  }

  return getContract({
    client: client,
    chain: mantleFork,
    address: contractAddress as `0x${string}`,
    abi: HealthcareRegistration__factory.abi,
  });
};
