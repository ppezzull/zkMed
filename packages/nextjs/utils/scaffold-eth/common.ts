// Basic dashboard path router for zkMed roles
import type { UserType } from "~~/types/healthcare";

// To be used in JSON.stringify when a field might be bigint

// https://wagmi.sh/react/faq#bigint-serialization
export const replacer = (_key: string, value: unknown) => (typeof value === "bigint" ? value.toString() : value);

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const isZeroAddress = (address: string) => address === ZERO_ADDRESS;

export function getUserDashboardPath(userType: UserType | null, isAdmin: boolean): string {
  if (isAdmin) return "/admin";
  switch (userType) {
    case 0: // UserType.PATIENT
      return "/patient";
    case 1: // UserType.HOSPITAL
      return "/hospital";
    case 2: // UserType.INSURER
      return "/insurance";
    default:
      return "/register";
  }
}
