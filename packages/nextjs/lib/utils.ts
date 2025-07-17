import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to get healthcare contract - placeholder for now
export function getHealthcareContract() {
  // This will be implemented when we have the actual contract setup
  throw new Error("Healthcare contract not yet implemented");
}
