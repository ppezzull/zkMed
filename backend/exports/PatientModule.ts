// Auto-generated TypeScript interface for PatientModule
export const PatientModuleABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_storage",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "core",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPatientCommitment",
    "inputs": [
      {
        "name": "_patient",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      {
        "name": "_core",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerPatient",
    "inputs": [
      {
        "name": "_patient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_commitment",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "storageContract",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract RegistrationStorage"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifyPatientCommitment",
    "inputs": [
      {
        "name": "_patient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_secret",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "PatientRegistered",
    "inputs": [
      {
        "name": "patient",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "commitment",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;

export interface PatientModuleContract {
  core(): Promise<string>;
  getPatientCommitment(_patient: string): Promise<string>;
  initialize(_core: string): Promise<void>;
  registerPatient(_patient: string, _commitment: string): Promise<void>;
  storageContract(): Promise<string>;
  verifyPatientCommitment(_patient: string, _secret: string): Promise<boolean>;
}

export interface PatientModuleEvents {
  PatientRegistered: { patient: string, commitment: string, timestamp: bigint };
}

export type PatientModuleAddress = `0x${string}`;

// Usage example:
// const contract = getContract({
//   address: "patientmoduleAddress",
//   abi: PatientModuleABI,
//   client: publicClient,
// });
