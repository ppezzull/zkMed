// Healthcare types matching contract structures

// Enums from contract
export enum UserType {
  PATIENT = 0,
  HOSPITAL = 1,
  INSURER = 2,
}

// Matches AdminLib.AdminRole in contracts
export enum AdminRole {
  UNREGISTERED = 0,
  BASIC = 1,
  MODERATOR = 2,
  SUPER_ADMIN = 3,
}

export enum RequestStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export enum RequestType {
  PATIENT_REGISTRATION = 0,
  ORG_REGISTRATION = 1,
  ADMIN_ACCESS = 2,
}

// Base record structure
export interface BaseRecord {
  walletAddress: string;
  emailHash: `0x${string}`;
  registrationTime: bigint;
  isActive: boolean;
  requestId: bigint;
}

// Specialized records
export interface PatientRecord {
  base: BaseRecord;
}

export interface OrganizationRecord {
  base: BaseRecord;
  orgType: UserType;
  domain: string;
  organizationName: string;
}

export interface AdminRecord {
  isActive: boolean;
  role: AdminRole;
  permissions: bigint;
  adminSince: bigint;
}

// Request structures
export interface BaseRequest {
  requester: string;
  requestType: RequestType;
  status: RequestStatus;
  requestTime: bigint;
  processedBy: string;
  processedTime: bigint;
}

export interface PatientRegistrationRequest {
  base: BaseRequest;
  emailHash: `0x${string}`;
}

export interface OrganizationRegistrationRequest {
  base: BaseRequest;
  orgType: UserType;
  domain: string;
  organizationName: string;
  emailHash: `0x${string}`;
}

export interface AdminAccessRequest {
  base: BaseRequest;
  adminRole: AdminRole;
  reason: string;
}

// Registration data from prover
export interface RegistrationData {
  // For organization registration (HOSPITAL=0, INSURER=1)
  requestedRole: number;
  walletAddress: string;
  domain: string;
  organizationName: string;
  emailHash: `0x${string}`;
}

// Statistics
export interface RegistrationStats {
  totalRegisteredUsers: bigint;
  totalPatients: bigint;
  totalHospitals: bigint;
  totalInsurers: bigint;
}

// User verification data
export interface UserVerificationData {
  userType: UserType | null;
  isActive: boolean;
  isAdmin: boolean;
  adminRole?: AdminRole;
  permissions?: bigint;
  domain?: string;
  organizationName?: string;
}

// Proof verification types
export interface ProofData {
  proof: any; // vlayer proof structure
  registrationData: RegistrationData;
}
