import { http, createConfig } from "wagmi";
import { l1Chain, l2Chain } from "./network";
import { injected, metaMask, safe } from "wagmi/connectors";

export const config = createConfig({
  chains: [l1Chain, l2Chain],
  connectors: [injected(), metaMask(), safe()],
  transports: {
    [l1Chain.id]: http(),
    [l2Chain.id]: http(),
  },
});
