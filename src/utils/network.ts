import { l1Chain, l2Chain } from "@/config/network";
import { ChainLayerEnum } from "@/types/network";
import { Chain } from "viem";

export const getChainLayer = (chainId: number): ChainLayerEnum => {
  if (chainId === l1Chain.id) return ChainLayerEnum.L1;
  if (chainId === l2Chain.id) return ChainLayerEnum.L2;
  return ChainLayerEnum.UNKNOWN;
};

export const getChainById = (chainId: number): Chain => {
  if (chainId === l1Chain.id) return l1Chain;
  if (chainId === l2Chain.id) return l2Chain;
  return l1Chain;
};

export const isHTTPS = (url: string) => {
  if (url.startsWith("https://")) return true;
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "host.docker.internal"
    );
  } catch {
    return false;
  }
};

export const getRPCUrlFromChainId = (chainId: number) => {
  if (chainId === l1Chain.id) return l1Chain.rpcUrls.default.http[0];
  if (chainId === l2Chain.id) return l2Chain.rpcUrls.default.http[0];
  return l1Chain.rpcUrls.default.http[0];
};
