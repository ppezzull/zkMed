// lib/contracts.ts
import { getContract } from "thirdweb";
import { client } from "./client";
import { defineChain } from "thirdweb/chains";
import { RegistrationContractABI } from "@/contracts/RegistrationContract";
import { REGISTRATION_CONTRACT } from "@/contracts/addresses";

// Define the local chain (Anvil)
export const localChain = defineChain({
  id: 31337,
  name: "Anvil Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpc: "http://127.0.0.1:8545",
});

// Contract addresses - now using real deployed addresses
export const CONTRACT_ADDRESSES = {
  REGISTRATION: REGISTRATION_CONTRACT,
} as const;

// Contract instances
export const registrationContract = getContract({
  client,
  chain: localChain,
  address: CONTRACT_ADDRESSES.REGISTRATION,
  abi: RegistrationContractABI,
});

// Helper function to get contract with specific chain
export function getRegistrationContract(chainId: number = 31337) {
  const chain = chainId === 31337 ? localChain : defineChain({ id: chainId });
  
  return getContract({
    client,
    chain,
    address: CONTRACT_ADDRESSES.REGISTRATION,
    abi: RegistrationContractABI,
  });
} 