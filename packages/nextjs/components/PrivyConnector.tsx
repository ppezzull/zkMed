"use client";

// components/PrivyConnector.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useConnectOrCreateWallet, usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export function HeaderConnectButton() {
  const router = useRouter();
  // Privy auth state and actions
  const { ready, authenticated, logout, user } = usePrivy();
  const { address } = useAccount();
  // Track if this is the first login to avoid logging on every render
  const hasLoggedFirstLogin = useRef(false);

  // Wallet connect method with callbacks for embedded AA wallets
  const { connectOrCreateWallet } = useConnectOrCreateWallet({
    onSuccess: wallet => {
      console.log("Smart Account wallet connected successfully", wallet);
    },
    onError: error => {
      console.error("Wallet connection failed", error);
    },
  });

  const effectiveAddress = useMemo(() => {
    return (address || user?.wallet?.address || "").toLowerCase() as `0x${string}` | "";
  }, [address, user?.wallet?.address]);

  const { data: roleData } = useScaffoldReadContract({
    contractName: "zkMedCore",
    functionName: "getRole",
    args: effectiveAddress ? [effectiveAddress] : undefined,
    // query disabled automatically when args contain undefined
  } as any);

  useEffect(() => {
    if (!ready || !authenticated || !effectiveAddress || !roleData || hasLoggedFirstLogin.current) return;
    try {
      const role = (roleData as any)?.[0] || "UNREGISTERED";
      const isActive = (roleData as any)?.[1] || false;
      if (role === "UNREGISTERED" || !isActive) {
        router.push("/register");
      } else if (role === "PATIENT") {
        router.push("/patient");
      } else if (role === "HOSPITAL") {
        router.push("/hospital");
      } else if (role === "INSURER") {
        router.push("/insurance");
      } else if (role === "ADMIN") {
        router.push("/admin");
      }
      hasLoggedFirstLogin.current = true;
    } catch (e) {
      console.error("Failed to route by role", e);
    }
  }, [ready, authenticated, effectiveAddress, roleData, router]);

  // Show loading state while SDK initializes
  if (!ready) {
    return (
      <button disabled className="btn btn-primary btn-sm">
        Loading…
      </button>
    );
  }

  // If authenticated, show user info and disconnect option
  if (authenticated) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm">
          {user?.email?.address ? user?.email?.address : address?.slice(0, 6) + "..." + address?.slice(-4)}
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-2xl border border-gray-500 text-gray-300 font-semibold hover:border-gray-400 hover:text-white transition-all duration-300"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Show connect button for unauthenticated users
  return (
    <button
      onClick={() => connectOrCreateWallet()}
      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
    >
      Connect Smart Wallet
    </button>
  );
}
