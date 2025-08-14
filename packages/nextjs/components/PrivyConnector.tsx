// components/PrivyConnector.tsx
// import React, { useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
import { useConnectOrCreateWallet, usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

// import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export function HeaderConnectButton() {
  // const router = useRouter();
  // Privy auth state and actions
  const { ready, authenticated, logout, user } = usePrivy();
  const { address } = useAccount();
  // Track if this is the first login to avoid logging on every render
  // const hasLoggedFirstLogin = useRef(false);

  // Wallet connect method with callbacks for embedded AA wallets
  const { connectOrCreateWallet } = useConnectOrCreateWallet({
    onSuccess: wallet => {
      console.log("Smart Account wallet connected successfully", wallet);
    },
    onError: err => {
      console.error("Wallet connection failed", err);
    },
  });

  // const { data: role, isLoading: isRoleLoading } = useScaffoldReadContract({
  //   contractName: "zkMedCore",
  //   functionName: "getRole",
  //   args: [user?.wallet?.address],
  // });

  // // Effect to detect when user becomes authenticated (covers other login methods)
  // useEffect(() => {
  //   if (authenticated && user && !hasLoggedFirstLogin.current && !isRoleLoading) {
  //     // Role is an enum: 0: UNREGISTERED, 1: PATIENT, 2: HOSPITAL, 3: INSURER, 4: ADMIN
  //     switch (role[0]) {
  //       case "UNREGISTERED":
  //         router.push("/register");
  //         break;
  //       case "PATIENT":
  //         router.push("/patient");
  //         break;
  //       case "HOSPITAL":
  //         router.push("/hospital");
  //         break;
  //       case "INSURER":
  //         router.push("/insurer");
  //         break;
  //       case "ADMIN":
  //         router.push("/admin");
  //         break;
  //     }
  //     hasLoggedFirstLogin.current = true;
  //   }

  //   // Reset flag when user logs out
  //   if (!authenticated) {
  //     hasLoggedFirstLogin.current = false;
  //   }
  // }, [authenticated, user, wallets, role, isRoleLoading, router]);

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
        <div className="text-sm">{user?.email?.address ? user?.email?.address : address}</div>
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
      onClick={connectOrCreateWallet}
      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
    >
      Connect Smart Wallet
    </button>
  );
}
