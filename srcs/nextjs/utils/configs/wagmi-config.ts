import { Chain } from "wagmi/chains";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const appKitProjectId = `282d43f90370c66486dcc9172b9576f7`; // Using the thirdweb client ID

// Define the mantle fork chain for development
const mantleFork: Chain = {
  id: 31337,
  name: "Mantle Fork",
  nativeCurrency: {
    decimals: 18,
    name: "Mantle",
    symbol: "MNT",
  },
  rpcUrls: {
    default: {
      http: ["http://anvil-l2-mantle:8545"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "" },
  },
};

const chains: [Chain, ...Chain[]] = [mantleFork];
const networks = chains;

const wagmiAdapter = new WagmiAdapter({
  projectId: appKitProjectId,
  chains,
  networks,
});

createAppKit({
  adapters: [wagmiAdapter],
  projectId: appKitProjectId,
  networks,
  defaultNetwork: mantleFork,
  metadata: {
    name: "zkMed",
    description: "Privacy-Preserving Healthcare with Yield",
    url: "https://zkmed.xyz",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
  },
  themeVariables: {
    "--w3m-color-mix": "#551fbc",
    "--w3m-color-mix-strength": 40,
  },
});

const { wagmiConfig } = wagmiAdapter;

export { wagmiConfig }; 