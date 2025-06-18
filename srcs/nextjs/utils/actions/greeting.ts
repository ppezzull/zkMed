"use server";

import { readContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { Greeting__factory } from "../types/examples/factories/Greeting__factory";
import { mantleFork } from "../configs/chain-config";
import fs from 'fs/promises';
import path from 'path';

// Create client for server-side calls
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id-here"
});

// Contract ABI
const GREETING_ABI = Greeting__factory.abi;

// Get dynamic contract address
async function getContractAddress(): Promise<string> {
  try {
    // Try to read from mounted contract artifacts
    const contractsPath = path.join(process.cwd(), 'contracts', 'addresses.json');
    const data = await fs.readFile(contractsPath, 'utf-8');
    const contractData = JSON.parse(data);
    return contractData.contracts.Greeting.address as `0x${string}`;
  } catch (error) {
    // Fallback to environment variable or default
    return process.env.NEXT_PUBLIC_GREETING_CONTRACT_ADDRESS || '0x922D6956C99E12DFeB3224DEA977D0939758A1Fe';
  }
}

// Read actions (view functions)
export async function getGreeting() {
  try {
    const contractAddress = await getContractAddress();
    const result = await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: GREETING_ABI,
        client,
        chain: mantleFork,
      },
      method: "getGreeting",
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('getGreeting error:', error);
    return { success: false, error: String(error) };
  }
}

export async function getUserGreeting(userAddress: string) {
  try {
    const contractAddress = await getContractAddress();
    const result = await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: GREETING_ABI,
        client,
        chain: mantleFork,
      },
      method: "getUserGreeting",
      params: [userAddress],
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getTotalGreetings() {
  try {
    const contractAddress = await getContractAddress();
    const result = await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: GREETING_ABI,
        client,
        chain: mantleFork,
      },
      method: "totalGreetings",
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('getTotalGreetings error:', error);
    return { success: false, error: String(error) };
  }
}

export async function getUserGreetingCount(userAddress: string) {
  try {
    const contractAddress = await getContractAddress();
    const result = await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: GREETING_ABI,
        client,
        chain: mantleFork,
      },
      method: "getUserGreetingCount",
      params: [userAddress],
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Export the address getter for use by other components
export async function getGreetingContractAddress(): Promise<string> {
  return await getContractAddress();
}

// Note: Write transactions are handled client-side with thirdweb hooks
// Server actions are for read-only operations 