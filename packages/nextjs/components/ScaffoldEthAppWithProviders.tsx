"use client";

// import { usePathname } from "next/navigation";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProofProvider } from "@vlayer/react";
import { getChainSpecs } from "@vlayer/sdk";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";
import { useChainId } from "wagmi";
// import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { privyConfig } from "~~/services/web3/privyConfig";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();
  // const pathname = usePathname();

  // Don't show Scaffold-ETH header/footer on:
  // - Homepage (has its own HealthcareHeader)
  // - Registration pages
  // - Dashboard pages (admin, patient, hospital, insurance)
  // const showScaffoldHeader =
  //   pathname !== "/" &&
  //   !pathname.startsWith("/register") &&
  //   !pathname.startsWith("/admin") &&
  //   !pathname.startsWith("/patient") &&
  //   !pathname.startsWith("/hospital") &&
  //   !pathname.startsWith("/insurance");

  return (
    <>
      <div className={`flex flex-col min-h-screen `}>
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        {/* {showScaffoldHeader && <Footer />} */}
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
            <ProgressBar height="3px" color="#2299dd" />
            <ChainConsistencyCheck />
            <ScaffoldEthApp>{children}</ScaffoldEthApp>
          </ProofProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
