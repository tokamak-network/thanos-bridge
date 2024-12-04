import { Token } from "@/types/token";
import { l1Chain, l2Chain } from "@/config/network";
export const supportedTokens: Token[] = [
  {
    chainId: l1Chain.id,
    isNativeCurrency: true,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    bridgedTokenSymbol: "eth",
  },
  {
    chainId: l2Chain.id,
    isNativeCurrency: false,
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    address: "0x4200000000000000000000000000000000000486",
    bridgedTokenSymbol: "eth",
  },
  {
    chainId: l1Chain.id,
    isNativeCurrency: false,
    name: "Native Token",
    symbol: "NativeToken",
    decimals: 18,
    address:
      (process.env.NEXT_PUBLIC_NATIVE_TOKEN_L1_ADDRESS as `0x${string}`) ||
      "0x",
    bridgedTokenSymbol: "native",
  },
  {
    chainId: l2Chain.id,
    isNativeCurrency: true,
    name: "Native Token",
    symbol: "NativeToken",
    decimals: 18,
    bridgedTokenSymbol: "native",
  },
  // {
  //   chainId: l1Chain.id,
  //   isNativeCurrency: false,
  //   name: "Tether USD",
  //   symbol: "USDT",
  //   decimals: 6,
  //   address:
  //     process.env.L1_USDT_ADDRESS ||
  //     "0xdac17f958d2ee523a2206206994597c13d831ec7",
  // },
  // {
  //   chainId: l2Chain.id,
  //   isNativeCurrency: false,
  //   name: "USDT",
  //   symbol: "USDT",
  //   decimals: 6,
  //   address: process.env.L2_USDT_ADDRESS,
  // },
  {
    chainId: l1Chain.id,
    isNativeCurrency: false,
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
    address:
      (process.env.NEXT_PUBLIC_L1_USDC_ADDRESS as `0x${string}`) ||
      "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
  {
    chainId: l2Chain.id,
    isNativeCurrency: false,
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
    address: "0x4200000000000000000000000000000000000778",
  },
];
