// User role enum to match contract values
enum UserType {
  PATIENT = 0,
  HOSPITAL = 1,
  INSURER = 2
}

// Type aliases using contract-generated types
type UserRecord = {
  userType: UserType;
  walletAddress: string;
  domain: string;
  organizationName: string;
  emailHash: string;
  registrationTime: bigint;
  isActive: boolean;
};

type RegistrationStats = {
  totalUsers: bigint;
  patients: bigint;
  hospitals: bigint;
  insurers: bigint;
};

export {UserType, type UserRecord, type RegistrationStats };