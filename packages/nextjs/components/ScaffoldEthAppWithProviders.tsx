"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProofProvider } from "@vlayer/react";
import { getChainSpecs } from "@vlayer/sdk";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { useChainId } from "wagmi";
import { Header } from "~~/components/Header";
import { NetworkSwitcher } from "~~/components/NetworkSwitcher";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { privyConfig } from "~~/services/web3/privyConfig";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  return (
    <>
      <div className={`flex flex-col min-h-screen`}>
        <Header />
        <NetworkSwitcher />
        <main className="relative flex flex-col flex-1 bg-slate-900">{children}</main>
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const proverConfig = {
  proverUrl: process.env.NEXT_PUBLIC_VLAYER_PROVER_URL || "http://localhost:3000",
  token: process.env.NEXT_PUBLIC_VLAYER_API_TOKEN,
};

const ChainConsistencyCheck = () => {
  const chainId = useChainId();
  try {
    const expected = getChainSpecs(process.env.NEXT_PUBLIC_CHAIN_NAME || "anvil");
    if (expected?.id && expected.id !== chainId) {
      console.warn(
        `vlayer/wagmi chain mismatch: wagmi=${chainId} vlayer=${expected.id}. Check NEXT_PUBLIC_CHAIN_NAME and wagmi config.`,
      );
    }
  } catch (e) {
    console.warn("getChainSpecs failed. Check NEXT_PUBLIC_CHAIN_NAME.", e);
  }
  return null;
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider appId={scaffoldConfig.privyProjectId} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        {/* Single wagmi provider */}
        <WagmiProvider config={wagmiConfig} reconnectOnMount>
          <ProofProvider config={proverConfig}>
            <ProgressBar height="3px" color="#2299dd" options={{ showSpinner: false }} />
            <ChainConsistencyCheck />
            <ScaffoldEthApp>{children}</ScaffoldEthApp>
          </ProofProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
