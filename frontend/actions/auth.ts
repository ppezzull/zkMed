"use server";

import { VerifyLoginPayloadParams, createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { client } from "@/lib/client";
import { cookies } from "next/headers";
import { createHash } from "crypto";

// Generate a deterministic private key from thirdweb secret and user address
function generateDeterministicPrivateKey(userAddress: string): string {
  const thirdwebSecret = process.env.THIRDWEB_SECRET_KEY;
  if (!thirdwebSecret) {
    throw new Error("Missing THIRDWEB_SECRET_KEY in .env file.");
  }
  
  // Create a deterministic private key using thirdweb secret + user address
  const combined = `${thirdwebSecret}:${userAddress.toLowerCase()}`;
  const hash = createHash('sha256').update(combined).digest('hex');
  return `0x${hash}`;
}

// Create auth instance with deterministic admin account
function createAuthForUser(userAddress: string) {
  const deterministicPrivateKey = generateDeterministicPrivateKey(userAddress);
  
  return createAuth({
    domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
    adminAccount: privateKeyToAccount({ client, privateKey: deterministicPrivateKey }),
    client: client,
  });
}

export async function generatePayload({ address }: { address: string }) {
  const thirdwebAuth = createAuthForUser(address);
  return thirdwebAuth.generatePayload({ address });
}

export async function login(payload: VerifyLoginPayloadParams) {
  const userAddress = payload.payload.address;
  const thirdwebAuth = createAuthForUser(userAddress);
  
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    (await cookies()).set("jwt", jwt);
  }
}

export async function isLoggedIn() {
  const jwt = (await cookies()).get("jwt");
  if (!jwt?.value) {
    return false;
  }

  // Extract user address from JWT to create the right auth instance
  try {
    const [, payloadBase64] = jwt.value.split('.');
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    const userAddress = payload.sub;
    
    const thirdwebAuth = createAuthForUser(userAddress);
    const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
    return authResult.valid;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return false;
  }
}

export async function logout() {
  (await cookies()).delete("jwt");
}

export async function getUser() {
  const jwt = (await cookies()).get("jwt");
  if (!jwt?.value) {
    return null;
  }

  try {
    const [, payloadBase64] = jwt.value.split('.');
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    const userAddress = payload.sub;
    
    const thirdwebAuth = createAuthForUser(userAddress);
    const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
    if (authResult.valid) {
      return authResult.parsedJWT;
    }
  } catch (error) {
    console.error("Error getting user:", error);
  }
  return null;
} 