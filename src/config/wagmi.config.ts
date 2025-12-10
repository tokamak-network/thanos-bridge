import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { l1Chain, l2Chain } from "./network";

export const config = createConfig({
  chains: [l1Chain, l2Chain],
  connectors: [metaMask()],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [l1Chain.id]: http(),
    [l2Chain.id]: http(),
  },
});
