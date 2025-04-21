import { BridgeInfoEnum } from "@/types/bridge";
import { env } from "next-runtime-env";

export const secondsToHHMMSS = (seconds: number): string => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes > 0)
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  if (remainingSeconds > 0)
    parts.push(
      `${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}`
    );

  return parts.join(" ") || "0s";
};

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
    case BridgeInfoEnum.OTHER_INFO:
      return [
        {
          title: "Block batching period",
          content: secondsToHHMMSS(
            parseInt(env("NEXT_PUBLIC_L2_BLOCK_BATCHING_PERIOD") || "432000")
          ),
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
