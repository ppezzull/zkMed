// Mock data for all zkMed application pages
// This file replaces all action calls across the app with mock data for easier testing and development
//
// Pages updated to use mock data:
// - app/admin/page.tsx (mockGetRegistrationStats, mockGetPendingRequests, mockGetPendingRequestsByType)
// - app/patient/[address]/page.tsx (mockGetPatientRecord, mockGetUserVerificationData)
// - app/hospital/[address]/page.tsx (mockGetOrganizationRecord, mockGetUserVerificationData)
// - app/insurance/[address]/page.tsx (mockGetOrganizationRecord, mockGetUserVerificationData)
// - app/demo/page.tsx (mockGetRegistrationStats, mockIsLoggedIn)
//
// Demo URLs for testing:
// Patient: http://localhost:5173/patient/0x7890123456789012345678901234567890123456
// Hospital: http://localhost:5173/hospital/0x1234567890123456789012345678901234567890
// Hospital (alt): http://localhost:5173/hospital/0x3456789012345678901234567890123456789012
// Insurance: http://localhost:5173/insurance/0x2345678901234567890123456789012345678901
// Admin: http://localhost:5173/admin
// Demo: http://localhost:5173/demo
import {
  AdminAccessRequest,
  AdminRecord,
  AdminRole,
  OrganizationRecord,
  OrganizationRegistrationRequest,
  PatientRecord,
  PatientRegistrationRequest,
  RegistrationData,
  RegistrationStats,
  RequestStatus,
  RequestType,
  UserType,
  UserVerificationData,
} from "~~/types/healthcare";

// Mock registration statistics
export const mockRegistrationStats: RegistrationStats = {
  totalRegisteredUsers: BigInt(1247),
  totalPatients: BigInt(892),
  totalHospitals: BigInt(23),
  totalInsurers: BigInt(12),
};

// Mock patient records
export const mockPatientRecords: PatientRecord[] = [
  {
    base: {
      walletAddress: "0x1234567890123456789012345678901234567890",
      emailHash: "0xabc123456789012345678901234567890123456789012345678901234567890def" as `0x${string}`,
      registrationTime: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      isActive: true,
      requestId: BigInt(101),
    },
  },
  {
    base: {
      walletAddress: "0x2345678901234567890123456789012345678901",
      emailHash: "0xdef456789012345678901234567890123456789012345678901234567890abc123" as `0x${string}`,
      registrationTime: BigInt(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      isActive: true,
      requestId: BigInt(102),
    },
  },
  {
    base: {
      walletAddress: "0x7890123456789012345678901234567890123456",
      emailHash: "0x789abc012345678901234567890123456789012345678901234567890def456123" as `0x${string}`,
      registrationTime: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      isActive: true,
      requestId: BigInt(103),
    },
  },
];

// Mock organization records
export const mockOrganizationRecords: OrganizationRecord[] = [
  {
    base: {
      walletAddress: "0x1234567890123456789012345678901234567890",
      emailHash: "0xabc123456789012345678901234567890123456789012345678901234567890def" as `0x${string}`,
      registrationTime: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      isActive: true,
      requestId: BigInt(101),
    },
    orgType: UserType.HOSPITAL,
    domain: "demohospital.com",
    organizationName: "Demo General Hospital",
  },
  {
    base: {
      walletAddress: "0x2345678901234567890123456789012345678901",
      emailHash: "0xdef456789012345678901234567890123456789012345678901234567890abc123" as `0x${string}`,
      registrationTime: BigInt(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      isActive: true,
      requestId: BigInt(102),
    },
    orgType: UserType.INSURER,
    domain: "demoinsurance.com",
    organizationName: "Demo Insurance Company",
  },
  {
    base: {
      walletAddress: "0x3456789012345678901234567890123456789012",
      emailHash: "0x123abc456789012345678901234567890123456789012345678901234567890def" as `0x${string}`,
      registrationTime: BigInt(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      isActive: true,
      requestId: BigInt(201),
    },
    orgType: UserType.HOSPITAL,
    domain: "cityhospital.com",
    organizationName: "City General Hospital",
  },
  {
    base: {
      walletAddress: "0x4567890123456789012345678901234567890123",
      emailHash: "0x456def789012345678901234567890123456789012345678901234567890abc123" as `0x${string}`,
      registrationTime: BigInt(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      isActive: true,
      requestId: BigInt(202),
    },
    orgType: UserType.INSURER,
    domain: "healthinsure.com",
    organizationName: "HealthSecure Insurance",
  },
];

// Mock admin records
export const mockAdminRecords: { [address: string]: AdminRecord } = {
  "0x5678901234567890123456789012345678901234": {
    isActive: true,
    role: AdminRole.SUPER_ADMIN,
    permissions: BigInt(0xffffffff), // All permissions
    adminSince: BigInt(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
  },
  "0x6789012345678901234567890123456789012345": {
    isActive: true,
    role: AdminRole.MODERATOR,
    permissions: BigInt(0x0000ffff), // Limited permissions
    adminSince: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
};

// Mock pending requests
export const mockPendingRequests = {
  patient: [
    {
      base: {
        requester: "0x7890123456789012345678901234567890123456",
        requestType: RequestType.PATIENT_REGISTRATION,
        status: RequestStatus.PENDING,
        requestTime: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        processedBy: "0x0000000000000000000000000000000000000000",
        processedTime: BigInt(0),
      },
      emailHash: "0x789abc012345678901234567890123456789012345678901234567890def456123" as `0x${string}`,
    } as PatientRegistrationRequest,
    {
      base: {
        requester: "0x8901234567890123456789012345678901234567",
        requestType: RequestType.PATIENT_REGISTRATION,
        status: RequestStatus.PENDING,
        requestTime: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        processedBy: "0x0000000000000000000000000000000000000000",
        processedTime: BigInt(0),
      },
      emailHash: "0x890def123456789012345678901234567890123456789012345678901abc456789" as `0x${string}`,
    } as PatientRegistrationRequest,
  ],
  organization: [
    {
      base: {
        requester: "0x9012345678901234567890123456789012345678",
        requestType: RequestType.ORG_REGISTRATION,
        status: RequestStatus.PENDING,
        requestTime: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        processedBy: "0x0000000000000000000000000000000000000000",
        processedTime: BigInt(0),
      },
      orgType: UserType.HOSPITAL,
      domain: "newmedcenter.com",
      organizationName: "New Medical Center",
      emailHash: "0x901abc234567890123456789012345678901234567890123456789def456789012" as `0x${string}`,
    } as OrganizationRegistrationRequest,
    {
      base: {
        requester: "0xa123456789012345678901234567890123456789",
        requestType: RequestType.ORG_REGISTRATION,
        status: RequestStatus.PENDING,
        requestTime: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        processedBy: "0x0000000000000000000000000000000000000000",
        processedTime: BigInt(0),
      },
      orgType: UserType.INSURER,
      domain: "safeguardins.com",
      organizationName: "SafeGuard Insurance",
      emailHash: "0xa12def345678901234567890123456789012345678901234567890abc456789123" as `0x${string}`,
    } as OrganizationRegistrationRequest,
  ],
  admin: [
    {
      base: {
        requester: "0xb234567890123456789012345678901234567890",
        requestType: RequestType.ADMIN_ACCESS,
        status: RequestStatus.PENDING,
        requestTime: BigInt(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        processedBy: "0x0000000000000000000000000000000000000000",
        processedTime: BigInt(0),
      },
      adminRole: AdminRole.MODERATOR,
      reason: "Need access to moderate user registrations",
    } as AdminAccessRequest,
  ],
};

// All pending requests combined
export const mockAllPendingRequests = [
  ...mockPendingRequests.patient,
  ...mockPendingRequests.organization,
  ...mockPendingRequests.admin,
];

// Mock user verification data
export const mockUserVerificationData: { [address: string]: UserVerificationData } = {
  "0x1234567890123456789012345678901234567890": {
    userType: UserType.HOSPITAL,
    isActive: true,
    isAdmin: false,
    domain: "demohospital.com",
    organizationName: "Demo General Hospital",
  },
  "0x2345678901234567890123456789012345678901": {
    userType: UserType.INSURER,
    isActive: true,
    isAdmin: false,
    domain: "demoinsurance.com",
    organizationName: "Demo Insurance Company",
  },
  "0x3456789012345678901234567890123456789012": {
    userType: UserType.HOSPITAL,
    isActive: true,
    isAdmin: false,
    domain: "cityhospital.com",
    organizationName: "City General Hospital",
  },
  "0x4567890123456789012345678901234567890123": {
    userType: UserType.INSURER,
    isActive: true,
    isAdmin: false,
    domain: "healthinsure.com",
    organizationName: "HealthSecure Insurance",
  },
  "0x5678901234567890123456789012345678901234": {
    userType: null,
    isActive: true,
    isAdmin: true,
    adminRole: AdminRole.SUPER_ADMIN,
    permissions: BigInt(0xffffffff),
  },
  "0x6789012345678901234567890123456789012345": {
    userType: null,
    isActive: true,
    isAdmin: true,
    adminRole: AdminRole.MODERATOR,
    permissions: BigInt(0x0000ffff),
  },
  "0x7890123456789012345678901234567890123456": {
    userType: UserType.PATIENT,
    isActive: true,
    isAdmin: false,
  },
};

// Mock functions to simulate the actual API calls
export const mockGetRegistrationStats = async (): Promise<RegistrationStats> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockRegistrationStats;
};

export const mockGetPendingRequests = async (): Promise<bigint[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockAllPendingRequests.map(req => req.base.requestTime);
};

export const mockGetPendingRequestsByType = async (type: RequestType): Promise<bigint[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  switch (type) {
    case RequestType.PATIENT_REGISTRATION:
      return mockPendingRequests.patient.map(req => req.base.requestTime);
    case RequestType.ORG_REGISTRATION:
      return mockPendingRequests.organization.map(req => req.base.requestTime);
    case RequestType.ADMIN_ACCESS:
      return mockPendingRequests.admin.map(req => req.base.requestTime);
    default:
      return [];
  }
};

// Alternative versions that return full request objects for components that need them
export const mockGetPendingRequestsDetailed = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockAllPendingRequests;
};

export const mockGetPendingRequestsByTypeDetailed = async (type: RequestType) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  switch (type) {
    case RequestType.PATIENT_REGISTRATION:
      return mockPendingRequests.patient;
    case RequestType.ORG_REGISTRATION:
      return mockPendingRequests.organization;
    case RequestType.ADMIN_ACCESS:
      return mockPendingRequests.admin;
    default:
      return [];
  }
};

export const mockGetPatientRecord = async (address: string): Promise<PatientRecord | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockPatientRecords.find(record => record.base.walletAddress.toLowerCase() === address.toLowerCase()) || null;
};

export const mockGetOrganizationRecord = async (address: string): Promise<OrganizationRecord | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return (
    mockOrganizationRecords.find(record => record.base.walletAddress.toLowerCase() === address.toLowerCase()) || null
  );
};

export const mockGetUserVerificationData = async (address: string): Promise<UserVerificationData | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  // First try the existing data structure
  const verification = mockUserVerificationData[address];
  if (verification) {
    return verification;
  }

  // If not found, try to construct it from patient/organization records
  const patientRecord = mockPatientRecords.find(p => p.base.walletAddress.toLowerCase() === address.toLowerCase());
  if (patientRecord) {
    return {
      userType: UserType.PATIENT,
      isActive: patientRecord.base.isActive,
      isAdmin: false,
      adminRole: undefined,
      permissions: undefined,
      domain: undefined,
      organizationName: undefined,
    };
  }

  const orgRecord = mockOrganizationRecords.find(o => o.base.walletAddress.toLowerCase() === address.toLowerCase());
  if (orgRecord) {
    return {
      userType: orgRecord.orgType,
      isActive: orgRecord.base.isActive,
      isAdmin: false,
      adminRole: undefined,
      permissions: undefined,
      domain: orgRecord.domain,
      organizationName: orgRecord.organizationName,
    };
  }

  // Check if admin
  const adminRecord = mockAdminRecords[address.toLowerCase()];
  if (adminRecord) {
    return {
      userType: null, // Admins don't have a specific user type
      isActive: adminRecord.isActive,
      isAdmin: true,
      adminRole: adminRecord.role,
      permissions: adminRecord.permissions,
      domain: undefined,
      organizationName: undefined,
    };
  }

  return null;
};

export const mockIsLoggedIn = async (): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return true; // Always logged in for demo purposes
};

// Mock registration data for demo
export const mockRegistrationData: RegistrationData = {
  requestedRole: UserType.PATIENT,
  walletAddress: "0xc345678901234567890123456789012345678901",
  domain: "",
  organizationName: "",
  emailHash: "0xc34def567890123456789012345678901234567890123456789abc456789012345" as `0x${string}`,
};

// Mock external provider functions
export function mockSetConnectedWallet(address: string) {
  // Look for user in patient records
  const patientRecord = mockPatientRecords.find(p => p.base.walletAddress.toLowerCase() === address.toLowerCase());
  if (patientRecord) {
    console.log(`Setting connected wallet: ${address} (Patient)`);
    return;
  }

  // Look for user in organization records
  const orgRecord = mockOrganizationRecords.find(o => o.base.walletAddress.toLowerCase() === address.toLowerCase());
  if (orgRecord) {
    console.log(
      `Setting connected wallet: ${address} (${orgRecord.orgType === UserType.HOSPITAL ? "Hospital" : "Insurance"})`,
    );
    return;
  }

  console.log(`Setting connected wallet: ${address} (Unknown)`);
}

// Default mock functions for static dashboards (without address parameter)
export const mockGetDefaultOrganizationRecord = async (
  type: "hospital" | "insurance",
): Promise<OrganizationRecord | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  // Return the first organization of the requested type
  const orgRecord = mockOrganizationRecords.find(record =>
    type === "hospital" ? record.orgType === UserType.HOSPITAL : record.orgType === UserType.INSURER,
  );

  return orgRecord || null;
};

export const mockGetDefaultUserVerificationData = async (
  type: "hospital" | "insurance",
): Promise<UserVerificationData | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  // Get the first organization of the requested type
  const orgRecord = mockOrganizationRecords.find(record =>
    type === "hospital" ? record.orgType === UserType.HOSPITAL : record.orgType === UserType.INSURER,
  );

  if (orgRecord) {
    return {
      userType: orgRecord.orgType,
      isActive: orgRecord.base.isActive,
      isAdmin: false,
      adminRole: undefined,
      permissions: undefined,
      domain: orgRecord.domain,
      organizationName: orgRecord.organizationName,
    };
  }

  return null;
};
