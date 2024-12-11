import { l1Chain, l2Chain } from "@/config/network";
import { jotaiGlobalLoading } from "@/jotai/loading";
import { useAtom } from "jotai";
import { useSwitchChain } from "wagmi";

export const useNetwork = () => {
  const [, setGlobalLoading] = useAtom(jotaiGlobalLoading);
  const { switchChainAsync } = useSwitchChain();

  const switchChain = async (chainId: number) => {
    setGlobalLoading(true);
    await switchChainAsync({ chainId });
    setGlobalLoading(false);
  };

  const switchToL1 = async () => {
    await switchChain(l1Chain.id);
  };

  const switchToL2 = async () => {
    await switchChain(l2Chain.id);
  };

  return { switchChain, switchChainAsync, switchToL1, switchToL2 };
};
