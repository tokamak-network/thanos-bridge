import { l1Chain, l2Chain } from "@/config/network";
import { jotaiInvalidRPCWarningModalOpen } from "@/jotai/bridge";
import { jotaiGlobalLoading } from "@/jotai/loading";
import { getRPCUrlFromChainId, isHTTPS } from "@/utils/network";
import { useAtom } from "jotai";
import { useSwitchChain } from "wagmi";

export const useNetwork = () => {
  const [, setGlobalLoading] = useAtom(jotaiGlobalLoading);
  const { switchChainAsync } = useSwitchChain();
  const [, setInvalidRPCWarningModalOpen] = useAtom(
    jotaiInvalidRPCWarningModalOpen
  );

  const switchChain = async (chainId: number) => {
    const rpcUrl = getRPCUrlFromChainId(chainId);
    if (!isHTTPS(rpcUrl)) {
      await setInvalidRPCWarningModalOpen(true);
      console.error("Invalid RPC URL", rpcUrl);
      return;
    }
    setGlobalLoading(true);
    try {
      await switchChainAsync({ chainId });
    } catch (error) {
      setGlobalLoading(false);
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const switchToL1 = async () => {
    await switchChain(l1Chain.id);
  };

  const switchToL2 = async () => {
    await switchChain(l2Chain.id);
  };

  return { switchChain, switchChainAsync, switchToL1, switchToL2 };
};
