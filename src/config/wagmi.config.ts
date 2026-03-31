import { createConfig, http, cookieStorage, createStorage, injected } from "wagmi";
import { l1Chain, l2Chain } from "./network";

export const config = createConfig({
  chains: [l1Chain, l2Chain],
  connectors: [injected()],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [l1Chain.id]: http(),
    [l2Chain.id]: http(),
  },
});
