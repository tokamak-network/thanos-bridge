import { Chain } from "wagmi/chains";

export const l1Chain: Chain = {
  id: Number(process.env.NEXT_PUBLIC_L1_CHAIN_ID || "1"),
  name: process.env.NEXT_PUBLIC_L1_CHAIN_NAME || "Ethereum",
  nativeCurrency: {
    name: process.env.NEXT_PUBLIC_L1_NATIVE_CURRENCY_NAME || "Ether",
    symbol: process.env.NEXT_PUBLIC_L1_NATIVE_CURRENCY_SYMBOL || "ETH",
    decimals: Number(
      process.env.NEXT_PUBLIC_L1_NATIVE_CURRENCY_DECIMALS || "18"
    ),
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_L1_RPC || "https://cloudflare-eth.com"],
    },
  },
  blockExplorers: {
    default: {
      name: process.env.NEXT_PUBLIC_L1_BLOCK_EXPLORER || "Etherscan",
      url: process.env.NEXT_PUBLIC_L1_BLOCK_EXPLORER || "https://etherscan.io",
    },
  },
};

export const l2Chain: Chain = {
  id: Number(process.env.NEXT_PUBLIC_L2_CHAIN_ID || "55007"),
  name: process.env.NEXT_PUBLIC_L2_CHAIN_NAME || "Titan Sepolia",
  nativeCurrency: {
    name:
      process.env.NEXT_PUBLIC_L2_NATIVE_CURRENCY_NAME || "Titan Sepolia Ether",
    symbol: process.env.NEXT_PUBLIC_L2_NATIVE_CURRENCY_SYMBOL || "ETH",
    decimals: Number(
      process.env.NEXT_PUBLIC_L2_NATIVE_CURRENCY_DECIMALS || "18"
    ),
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_L2_RPC ||
          "https://rpc.titan-sepolia.tokamak.network",
      ],
    },
  },
  blockExplorers: {
    default: {
      name:
        process.env.NEXT_PUBLIC_L2_BLOCK_EXPLORER || "Titan Sepolia Explorer",
      url:
        process.env.NEXT_PUBLIC_L2_BLOCK_EXPLORER ||
        "https://explorer.titan-sepolia.tokamak.network",
    },
  },
};
