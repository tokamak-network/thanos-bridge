import { l1Chain, l2Chain } from "@/config/network";
import { ethers } from "ethers";

export const l1Provider = new ethers.providers.JsonRpcProvider(
  l1Chain.rpcUrls.default.http[0]
);
export const l2Provider = new ethers.providers.JsonRpcProvider(
  l2Chain.rpcUrls.default.http[0]
);
