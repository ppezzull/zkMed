// Generated TypeScript interfaces for zkMed contracts
// Generated at: 2025-05-31T13:53:15.513Z

// Generated TypeScript interface for RegistrationContract

export interface RegistrationContractFunctions {
  _setTestVerifier(: string): Promise<void>;
  activateUser(_user: string): Promise<void>;
  activeUsers(_user: string): Promise<boolean>;
  addAdmin(_newAdmin: string): Promise<void>;
  addOwner(_newOwner: string): Promise<void>;
  admin(): Promise<string>;
  adminModule(): Promise<string>;
  admins(_admin: string): Promise<boolean>;
  batchActivateUsers(_users: string[]): Promise<void>;
  batchDeactivateUsers(_users: string[]): Promise<void>;
  completeOrganizationRegistration(organizationName: string, domain: string, _role: number | string): Promise<void>;
  deactivateUser(_user: string): Promise<void>;
  deactivationTimestamp(_user: string): Promise<number | string>;
  domainToAddress(_domain: string): Promise<string>;
  emailDomainProver(): Promise<string>;
  emailHashToAddress(_emailHash: string): Promise<string>;
  getDomainOwner(_domain: string): Promise<string>;
  getEmailHashOwner(_emailHash: string): Promise<string>;
  getOrganization(_organization: string): Promise<any>;
  getOwners(): Promise<string[]>;
  getUserActivationStatus(_user: string): Promise<any[]>;
  getUserRegistration(_user: string): Promise<any[]>;
  isDomainRegistered(_domain: string): Promise<boolean>;
  isEmailHashUsed(_emailHash: string): Promise<boolean>;
  isOwner(_address: string): Promise<boolean>;
  isUserActive(_user: string): Promise<boolean>;
  isUserVerified(_user: string): Promise<boolean>;
  organizationModule(): Promise<string>;
  organizations(_org: string): Promise<any[]>;
  owner(): Promise<string>;
  owners(_owner: string): Promise<boolean>;
  patientCommitments(_patient: string): Promise<string>;
  patientModule(): Promise<string>;
  registerOrganization(proof: any, orgData: any, _role: number | string): Promise<void>;
  registerPatient(_commitment: string): Promise<void>;
  registrationTimestamps(_user: string): Promise<number | string>;
  removeAdmin(_admin: string): Promise<void>;
  removeOwner(_owner: string): Promise<void>;
  renounceOwnership(): Promise<void>;
  resetEmailHash(_emailHash: string): Promise<void>;
  roles(_user: string): Promise<number | string>;
  storageContract(): Promise<string>;
  transferOwnership(newOwner: string): Promise<void>;
  updateVerificationStatus(_user: string, _verified: boolean): Promise<void>;
  usedEmailHashes(_emailHash: string): Promise<boolean>;
  verified(_user: string): Promise<boolean>;
  verifier(): Promise<string>;
  verifyAndStoreURL(proof: any, domain: string, emailHash: string): Promise<void>;
  verifyDomainOwnership(proof: any, emailHash: string, targetWallet: string, domain: string): Promise<void>;
  verifyPatientCommitment(_secret: string): Promise<boolean>;
}

export interface RegistrationContractEvents {
  AdminAdded: { admin: string };
  AdminRemoved: { admin: string };
  DomainVerified: { user: string, domain: string, emailHash: string, timestamp: number | string };
  EmailProofVerified: { organization: string, domain: string, emailHash: string, timestamp: number | string };
  OrganizationRegistered: { organization: string, domain: string, name: string, role: number | string, timestamp: number | string };
  OwnerAdded: { newOwner: string, addedBy: string };
  OwnerRemoved: { removedOwner: string, removedBy: string };
  OwnershipTransferRequested: { currentOwner: string, newOwner: string };
  OwnershipTransferred: { previousOwner: string, newOwner: string };
  PatientRegistered: { patient: string, commitment: string, timestamp: number | string };
  RoleAssigned: { user: string, role: number | string, timestamp: number | string };
  UserActivated: { user: string, activatedBy: string };
  UserDeactivated: { user: string, deactivatedBy: string };
  VerificationStatusChanged: { user: string, verified: boolean, timestamp: number | string };
}

export interface RegistrationContractContract {
  address: string;
  abi: any[];
  functions: RegistrationContractFunctions;
  events: RegistrationContractEvents;
}


// Generated TypeScript interface for RegistrationStorage

export interface RegistrationStorageFunctions {
  activeUsers(: string): Promise<boolean>;
  admins(: string): Promise<boolean>;
  authorizeModule(_module: string): Promise<void>;
  authorizedModules(: string): Promise<boolean>;
  deactivationTimestamp(: string): Promise<number | string>;
  domainToAddress(: string): Promise<string>;
  emailHashToAddress(: string): Promise<string>;
  getOwners(): Promise<string[]>;
  isUserActive(_user: string): Promise<boolean>;
  isUserVerified(_user: string): Promise<boolean>;
  organizations(: string): Promise<any[]>;
  owner(): Promise<string>;
  owners(: string): Promise<boolean>;
  ownersList(: number | string): Promise<string>;
  patientCommitments(: string): Promise<string>;
  registrationTimestamps(: string): Promise<number | string>;
  revokeModule(_module: string): Promise<void>;
  roles(: string): Promise<number | string>;
  setActiveUser(_user: string, _active: boolean): Promise<void>;
  setAdmin(_admin: string, _isAdmin: boolean): Promise<void>;
  setDomainToAddress(_domain: string, _address: string): Promise<void>;
  setEmailHashToAddress(_emailHash: string, _address: string): Promise<void>;
  setOrganization(_org: string, _organization: any): Promise<void>;
  setOwner(_owner: string, _isOwner: boolean): Promise<void>;
  setPatientCommitment(_patient: string, _commitment: string): Promise<void>;
  setRegistrationTimestamp(_user: string, _timestamp: number | string): Promise<void>;
  setRole(_user: string, _role: number | string): Promise<void>;
  setUsedEmailHash(_emailHash: string, _used: boolean): Promise<void>;
  setVerified(_user: string, _verified: boolean): Promise<void>;
  transferOwnership(_newOwner: string): Promise<void>;
  usedEmailHashes(: string): Promise<boolean>;
  verified(: string): Promise<boolean>;
}

export interface RegistrationStorageContract {
  address: string;
  abi: any[];
  functions: RegistrationStorageFunctions;
}


// Generated TypeScript interface for PatientModule

export interface PatientModuleFunctions {
  core(): Promise<string>;
  getPatientCommitment(_patient: string): Promise<string>;
  initialize(_core: string): Promise<void>;
  registerPatient(_patient: string, _commitment: string): Promise<void>;
  storageContract(): Promise<string>;
  verifyPatientCommitment(_patient: string, _secret: string): Promise<boolean>;
}

export interface PatientModuleEvents {
  PatientRegistered: { patient: string, commitment: string, timestamp: number | string };
}

export interface PatientModuleContract {
  address: string;
  abi: any[];
  functions: PatientModuleFunctions;
  events: PatientModuleEvents;
}


// Generated TypeScript interface for OrganizationModule

export interface OrganizationModuleFunctions {
  _setTestVerifier(newVerifier: string): Promise<void>;
  completeOrganizationRegistration(organization: string, organizationName: string, domain: string, _role: number | string): Promise<void>;
  core(): Promise<string>;
  emailDomainProver(): Promise<string>;
  initialize(_core: string): Promise<void>;
  registerOrganization(: any, orgData: any, _role: number | string): Promise<void>;
  storageContract(): Promise<string>;
  verifier(): Promise<string>;
  verifyAndStoreURL(: any, domain: string, emailHash: string, targetWallet: string): Promise<void>;
  verifyDomainOwnership(: any, emailHash: string, targetWallet: string, domain: string): Promise<void>;
}

export interface OrganizationModuleEvents {
  DomainVerified: { user: string, domain: string, emailHash: string, timestamp: number | string };
  EmailProofVerified: { organization: string, domain: string, emailHash: string, timestamp: number | string };
  OrganizationRegistered: { organization: string, domain: string, name: string, role: number | string, timestamp: number | string };
}

export interface OrganizationModuleContract {
  address: string;
  abi: any[];
  functions: OrganizationModuleFunctions;
  events: OrganizationModuleEvents;
}


// Generated TypeScript interface for AdminModule

export interface AdminModuleFunctions {
  MAX_OWNERS(): Promise<number | string>;
  activateUser(_user: string): Promise<void>;
  addAdmin(_newAdmin: string): Promise<void>;
  addOwner(_newOwner: string): Promise<void>;
  batchActivateUsers(_users: string[]): Promise<void>;
  batchDeactivateUsers(_users: string[]): Promise<void>;
  core(): Promise<string>;
  deactivateUser(_user: string): Promise<void>;
  getOwners(): Promise<string[]>;
  getUserActivationStatus(_user: string): Promise<any[]>;
  initialize(_core: string): Promise<void>;
  isOwner(_address: string): Promise<boolean>;
  removeAdmin(_admin: string): Promise<void>;
  removeOwner(_owner: string): Promise<void>;
  resetEmailHash(_emailHash: string): Promise<void>;
  storageContract(): Promise<string>;
  updateVerificationStatus(_user: string, _verified: boolean): Promise<void>;
}

export interface AdminModuleEvents {
  AdminAdded: { admin: string };
  AdminRemoved: { admin: string };
  OwnerAdded: { newOwner: string, addedBy: string };
  OwnerRemoved: { removedOwner: string, removedBy: string };
  UserActivated: { user: string, activatedBy: string };
  UserDeactivated: { user: string, deactivatedBy: string };
  VerificationStatusChanged: { user: string, verified: boolean, timestamp: number | string };
}

export interface AdminModuleContract {
  address: string;
  abi: any[];
  functions: AdminModuleFunctions;
  events: AdminModuleEvents;
}


// Generated TypeScript interface for EmailDomainProver

export interface EmailDomainProverFunctions {
  proof(): Promise<any>;
  setBlock(blockNo: number | string): Promise<void>;
  setChain(chainId: number | string, blockNo: number | string): Promise<void>;
  simpleDomainVerification(unverifiedEmail: any, : string): Promise<any[]>;
  stringToAddress(str: string): Promise<string>;
  verifyDomainOwnership(unverifiedEmail: any): Promise<any[]>;
  verifyOrganization(unverifiedEmail: any): Promise<any[]>;
}

export interface EmailDomainProverContract {
  address: string;
  abi: any[];
  functions: EmailDomainProverFunctions;
}


