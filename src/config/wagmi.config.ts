import { createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { l1Chain, l2Chain } from "./network";

export const config = createConfig({
  chains: [l1Chain, l2Chain],
  connectors: [ metaMask()],
  transports: {
    [l1Chain.id]: http(),
    [l2Chain.id]: http(),
  },
});
