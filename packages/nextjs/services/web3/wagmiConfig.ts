import { coinbaseWallet, injected, walletConnect } from "@wagmi/connectors";
import { createConfig, http } from "wagmi";
import { anvil } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
  },
  connectors: [injected(), ...(projectId ? [walletConnect({ projectId })] : []), coinbaseWallet({ appName: "zkMed" })],
  ssr: true,
});
