import { BridgeTokenEnum, BridgeTransactionInfo } from "@/types/bridge";
import { useThanosSDK } from "./useThanosSDK";
import { l1Chain, l2Chain } from "@/config/network";
import { AddressLike } from "@tokamak-network/thanos-sdk";

export const useApprove = (
  setIsApproving: (value: boolean) => void,
  setIsApproved: (value: boolean) => void
) => {
  const { crossChainMessenger } = useThanosSDK(l1Chain.id, l2Chain.id);
  const approve = async (transaction: BridgeTransactionInfo) => {
    if (!crossChainMessenger) return;
    if (transaction.bridgeTokenType === BridgeTokenEnum.ETH) return;
    setIsApproving(true);
    try {
      const response =
        transaction.bridgeTokenType === BridgeTokenEnum.NATIVE_TOKEN
          ? await crossChainMessenger.approveNativeToken(
              transaction.amount.toString()
            )
          : await crossChainMessenger.approveERC20(
              transaction.l1Token?.address as AddressLike,
              transaction.l2Token?.address as AddressLike,
              transaction.amount.toString()
            );
      await response.wait();
      setIsApproved(true);
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsApproving(false);
    }
  };
  return { approve };
};
