import { createConfig, http, cookieStorage, createStorage, injected } from "wagmi";
import { l1Chain, l2Chain } from "./network";
import { env } from "next-runtime-env";

export const config = createConfig({
  chains: [l1Chain, l2Chain],
  connectors: [injected()],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [l1Chain.id]: http(
      env("NEXT_PUBLIC_L1_RPC") ||
        l1Chain.rpcUrls.default.http[0] ||
        "https://cloudflare-eth.com"
    ),
    [l2Chain.id]: http(
      env("NEXT_PUBLIC_L2_RPC") ||
        l2Chain.rpcUrls.default.http[0] ||
        "https://rpc.titan-sepolia.tokamak.network"
    ),
  },
});
