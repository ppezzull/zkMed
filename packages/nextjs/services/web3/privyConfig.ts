// privyConfig.ts
import type { PrivyClientConfig } from "@privy-io/react-auth";
import { anvil } from "viem/chains";

export const privyConfig: PrivyClientConfig = {
  // Configure embedded wallets for Account Abstraction
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    showWalletUIs: true,
  },
  // Multiple login methods for better UX
  loginMethods: ["wallet", "email", "sms", "google"],
  appearance: {
    showWalletLoginFirst: false, // Show social login first for embedded wallets
    theme: "light",
  },
  // Use the first enabled chain as default (usually the target network)
  defaultChain: anvil,
  // Support all chains from wagmi config
  supportedChains: [anvil],
};
