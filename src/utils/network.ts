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
