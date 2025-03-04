import { BridgeInfoEnum } from "@/types/bridge";
import { env } from "next-runtime-env";
export const getBridgeInfoByCategory = (category: BridgeInfoEnum) => {
  switch (category) {
    case BridgeInfoEnum.L1_CHAIN_INFO:
      return [
        { title: "Chain name", content: env("NEXT_PUBLIC_L1_CHAIN_NAME") },
        { title: "Chain ID", content: env("NEXT_PUBLIC_L1_CHAIN_ID") },
        { title: "RPC url", content: env("NEXT_PUBLIC_L1_RPC") },
        {
          title: "Native currency name",
          content: env("NEXT_PUBLIC_L1_NATIVE_CURRENCY_NAME"),
        },
        {
          title: "Native currency symbol",
          content: env("NEXT_PUBLIC_L1_NATIVE_CURRENCY_SYMBOL"),
        },
        {
          title: "Native currency decimals",
          content: env("NEXT_PUBLIC_L1_NATIVE_CURRENCY_DECIMALS"),
        },
        {
          title: "Block explorer",
          content: env("NEXT_PUBLIC_L1_BLOCK_EXPLORER"),
        },
      ];
    case BridgeInfoEnum.L2_CHAIN_INFO:
      return [
        { title: "Chain name", content: env("NEXT_PUBLIC_L2_CHAIN_NAME") },
        { title: "Chain ID", content: env("NEXT_PUBLIC_L2_CHAIN_ID") },
        { title: "RPC url", content: env("NEXT_PUBLIC_L2_RPC") },
        {
          title: "Native currency name",
          content: env("NEXT_PUBLIC_L2_NATIVE_CURRENCY_NAME"),
        },
        {
          title: "Native currency symbol",
          content: env("NEXT_PUBLIC_L2_NATIVE_CURRENCY_SYMBOL"),
        },
        {
          title: "Native currency decimals",
          content: env("NEXT_PUBLIC_L2_NATIVE_CURRENCY_DECIMALS"),
        },
        {
          title: "Block explorer",
          content: env("NEXT_PUBLIC_L2_BLOCK_EXPLORER"),
        },
      ];
    default:
      return [
        {
          title: "Native token L1 address",
          content: env("NEXT_PUBLIC_NATIVE_TOKEN_L1_ADDRESS"),
        },
        {
          title: "Standard bridge address",
          content: env("NEXT_PUBLIC_STANDARD_BRIDGE_ADDRESS"),
        },
        {
          title: "L1 USDC bridge address",
          content: env("NEXT_PUBLIC_L1_USDC_BRIDGE_ADDRESS"),
        },
      ];
  }
};
