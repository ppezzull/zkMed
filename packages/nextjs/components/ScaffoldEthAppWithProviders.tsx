"use client";

import { usePathname } from "next/navigation";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProofProvider } from "@vlayer/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { privyConfig } from "~~/services/web3/privyConfig";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();
  const pathname = usePathname();

  // Don't show Scaffold-ETH header on homepage (it has its own HealthcareHeader) or registration pages
  const showScaffoldHeader = pathname !== "/" && !pathname.startsWith("/register");

  return (
    <>
      <div className={`flex flex-col min-h-screen `}>
        {showScaffoldHeader && <Header />}
        <main className="relative flex flex-col flex-1">{children}</main>
        {showScaffoldHeader && <Footer />}
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

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider appId={scaffoldConfig.privyProjectId} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          <ProofProvider config={proverConfig}>
            <ProgressBar height="3px" color="#2299dd" />
            <ScaffoldEthApp>{children}</ScaffoldEthApp>
          </ProofProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
