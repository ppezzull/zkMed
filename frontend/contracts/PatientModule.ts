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
    "name": "getItalianHealthData",
    "inputs": [
      {
        "name": "_patient",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "patientId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "taxCodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "regionalCode",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "homeAsl",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "verificationTimestamp",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPatientByHealthId",
    "inputs": [
      {
        "name": "_patientId",
        "type": "string",
        "internalType": "string"
      }
    ],
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
    "name": "getPatientByTaxCodeHash",
    "inputs": [
      {
        "name": "_taxCodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
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
    "name": "hasItalianHealthVerification",
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
        "type": "bool",
        "internalType": "bool"
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
    "name": "italianHealthData",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "patientId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "taxCodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "regionalCode",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "homeAsl",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "verificationTimestamp",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "patientIdToAddress",
    "inputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
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
    "name": "proposeOperation",
    "inputs": [
      {
        "name": "_webProof",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_procedureHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_estimatedUSDCCost",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "registerPatientWithWebProof",
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
      },
      {
        "name": "_patientId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_taxCodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_regionalCode",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_homeAsl",
        "type": "string",
        "internalType": "string"
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
    "name": "taxCodeHashToAddress",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
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
    "name": "uploadEncryptedEHR",
    "inputs": [
      {
        "name": "_cid",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_preKey",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "name": "EHRUploaded",
    "inputs": [
      {
        "name": "patient",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "cid",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OperationProposed",
    "inputs": [
      {
        "name": "patient",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "procedureHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "estimatedUSDCCost",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
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
  },
  {
    "type": "event",
    "name": "PatientRegisteredWithWebProof",
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
        "name": "patientId",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "taxCodeHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "regionalCode",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "homeAsl",
        "type": "string",
        "indexed": false,
        "internalType": "string"
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
  getItalianHealthData(_patient: string): Promise<string | string | string | string | bigint>;
  getPatientByHealthId(_patientId: string): Promise<string>;
  getPatientByTaxCodeHash(_taxCodeHash: string): Promise<string>;
  getPatientCommitment(_patient: string): Promise<string>;
  hasItalianHealthVerification(_patient: string): Promise<boolean>;
  initialize(_core: string): Promise<void>;
  italianHealthData(: string): Promise<string | string | string | string | bigint>;
  patientIdToAddress(: string): Promise<string>;
  proposeOperation(_webProof: string, _procedureHash: string, _estimatedUSDCCost: bigint): Promise<void>;
  registerPatient(_patient: string, _commitment: string): Promise<void>;
  registerPatientWithWebProof(_patient: string, _commitment: string, _patientId: string, _taxCodeHash: string, _regionalCode: string, _homeAsl: string): Promise<void>;
  storageContract(): Promise<string>;
  taxCodeHashToAddress(: string): Promise<string>;
  uploadEncryptedEHR(_cid: string, _preKey: string): Promise<void>;
  verifyPatientCommitment(_patient: string, _secret: string): Promise<boolean>;
}

export interface PatientModuleEvents {
  EHRUploaded: { patient: string, cid: string, timestamp: bigint };
  OperationProposed: { patient: string, procedureHash: string, estimatedUSDCCost: bigint, timestamp: bigint };
  PatientRegistered: { patient: string, commitment: string, timestamp: bigint };
  PatientRegisteredWithWebProof: { patient: string, commitment: string, patientId: string, taxCodeHash: string, regionalCode: string, homeAsl: string, timestamp: bigint };
}

export type PatientModuleAddress = `0x${string}`;

// Usage example with viem:
// const contract = getContract({
//   address: deployment.contracts.patientModule,
//   abi: PatientModuleABI,
//   client: publicClient,
// });

// Usage example with thirdweb:
// const contract = getContract({
//   client,
//   chain: defineChain(31337),
//   address: deployment.contracts.patientModule,
//   abi: PatientModuleABI,
// });
