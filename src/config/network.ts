import { Chain } from "wagmi/chains";
import { env } from "next-runtime-env";

export const l1Chain: Chain = {
  id: Number(env("NEXT_PUBLIC_L1_CHAIN_ID") || "1"),
  name: env("NEXT_PUBLIC_L1_CHAIN_NAME") || "Ethereum",
  nativeCurrency: {
    name: env("NEXT_PUBLIC_L1_NATIVE_CURRENCY_NAME") || "Ether",
    symbol: env("NEXT_PUBLIC_L1_NATIVE_CURRENCY_SYMBOL") || "ETH",
    decimals: Number(env("NEXT_PUBLIC_L1_NATIVE_CURRENCY_DECIMALS") || "18"),
  },
  rpcUrls: {
    default: {
      http: [env("NEXT_PUBLIC_L1_RPC") || "https://cloudflare-eth.com"],
    },
  },
  blockExplorers: {
    default: {
      name: env("NEXT_PUBLIC_L1_BLOCK_EXPLORER") || "Etherscan",
      url: env("NEXT_PUBLIC_L1_BLOCK_EXPLORER") || "https://etherscan.io",
    },
  },
};

export const l2Chain: Chain = {
  id: Number(env("NEXT_PUBLIC_L2_CHAIN_ID") || "55007"),
  name: env("NEXT_PUBLIC_L2_CHAIN_NAME") || "Titan Sepolia",
  nativeCurrency: {
    name: env("NEXT_PUBLIC_L2_NATIVE_CURRENCY_NAME") || "Titan Sepolia Ether",
    symbol: env("NEXT_PUBLIC_L2_NATIVE_CURRENCY_SYMBOL") || "ETH",
    decimals: Number(env("NEXT_PUBLIC_L2_NATIVE_CURRENCY_DECIMALS") || "18"),
  },
  rpcUrls: {
    default: {
      http: [
        env("NEXT_PUBLIC_L2_RPC") ||
          "https://rpc.titan-sepolia.tokamak.network",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: env("NEXT_PUBLIC_L2_BLOCK_EXPLORER") || "Titan Sepolia Explorer",
      url:
        env("NEXT_PUBLIC_L2_BLOCK_EXPLORER") ||
        "https://explorer.titan-sepolia.tokamak.network",
    },
  },
};
