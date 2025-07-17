import { createConfig, http } from "wagmi";
import { anvil } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
  },
});
