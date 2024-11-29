import { l1Chain, l2Chain } from "@/config/network";
import { ChainLayerEnum } from "@/types/network";

export const getChainLayer = (chainId: number): ChainLayerEnum => {
  if (chainId === l1Chain.id) return ChainLayerEnum.L1;
  if (chainId === l2Chain.id) return ChainLayerEnum.L2;
  return ChainLayerEnum.UNKNOWN;
};
