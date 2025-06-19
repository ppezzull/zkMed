export interface ContractAddresses {
  healthcareRegistration: string;
  healthcareRegistrationProver: string;
}

export function getContractAddresses(): ContractAddresses {
  const healthcareRegistration = process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS || '0x0000000000000000000000000000000000000000';
  const healthcareRegistrationProver = process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS || '0x0000000000000000000000000000000000000000';

  return {
    healthcareRegistration,
    healthcareRegistrationProver,
  };
}

export function isContractsConfigured(): boolean {
  const addresses = getContractAddresses();
  return addresses.healthcareRegistration !== '0x0000000000000000000000000000000000000000' &&
         addresses.healthcareRegistrationProver !== '0x0000000000000000000000000000000000000000';
}

export function getHealthcareRegistrationAddress(): string {
  return getContractAddresses().healthcareRegistration;
}

export function getHealthcareRegistrationProverAddress(): string {
  return getContractAddresses().healthcareRegistrationProver;
}