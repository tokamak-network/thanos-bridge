import { l1Chain, l2Chain } from "@/config/network";
import { useSwitchChain } from "wagmi";

export const useNetwork = () => {
  const { switchChainAsync } = useSwitchChain();

  const switchChain = async (chainId: number) => {
    await switchChainAsync({ chainId });
  };

  const switchToL1 = async () => {
    await switchChainAsync({ chainId: l1Chain.id });
  };

  const switchToL2 = async () => {
    await switchChainAsync({ chainId: l2Chain.id });
  };

  return { switchChain, switchChainAsync, switchToL1, switchToL2 };
};
