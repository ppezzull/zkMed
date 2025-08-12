import { createConfig, http } from "wagmi";
import { anvil } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "@wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
  },
  connectors: [
    injected(),
    ...(projectId ? [walletConnect({ projectId })] : []),
    coinbaseWallet({ appName: "zkMed" }),
  ],
  autoConnect: true,
  ssr: true,
});
