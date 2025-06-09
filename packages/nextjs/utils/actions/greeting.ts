"use server";

import { readContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { Greeting__factory } from "../types/contracts/factories/Greeting__factory";
import { mantleFork, GREETING_CONTRACT_ADDRESS } from "../chain-config";

// Create client for server-side calls
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id-here"
});

// Contract ABI
const GREETING_ABI = Greeting__factory.abi;

// Read actions (view functions)
export async function getGreeting() {
  try {
    const result = await readContract({
      contract: {
        address: GREETING_CONTRACT_ADDRESS,
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
    const result = await readContract({
      contract: {
        address: GREETING_CONTRACT_ADDRESS,
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
    const result = await readContract({
      contract: {
        address: GREETING_CONTRACT_ADDRESS,
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
    const result = await readContract({
      contract: {
        address: GREETING_CONTRACT_ADDRESS,
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

// Note: Write transactions are handled client-side with thirdweb hooks
// Server actions are for read-only operations 