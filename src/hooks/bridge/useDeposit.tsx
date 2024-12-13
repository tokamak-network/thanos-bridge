import { BridgeTokenEnum, BridgeTransactionInfo } from "@/types/bridge";
import { useThanosSDK } from "./useThanosSDK";
import { l1Chain, l2Chain } from "@/config/network";
import { TransactionStatusEnum } from "@/types/transaction";
import { AddressLike } from "@tokamak-network/thanos-sdk";

export const useDeposit = () => {
  const { crossChainMessenger } = useThanosSDK(l1Chain.id, l2Chain.id);
  const deposit = async (
    transaction: BridgeTransactionInfo,
    handleChangeTransactionState: (
      status: TransactionStatusEnum,
      txHash?: string
    ) => void,
    setIsApproved: (value: boolean) => void
  ) => {
    switch (transaction.bridgeTokenType) {
      case BridgeTokenEnum.ETH:
        try {
          if (!crossChainMessenger) return;
          handleChangeTransactionState(TransactionStatusEnum.READY_TO_CONFIRM);
          const response = await crossChainMessenger.bridgeETH(
            transaction.amount.toString(),
            {
              recipient: transaction.toAddress || undefined,
            }
          );
          handleChangeTransactionState(TransactionStatusEnum.CONFIRMING);
          const depositTx = await response.wait();
          handleChangeTransactionState(
            TransactionStatusEnum.SUCCESS,
            depositTx.transactionHash
          );
        } catch (error) {
          console.error(error);
          handleChangeTransactionState(TransactionStatusEnum.ERROR);
        }
        break;
      case BridgeTokenEnum.NATIVE_TOKEN:
        try {
          if (!crossChainMessenger) return;
          handleChangeTransactionState(TransactionStatusEnum.READY_TO_CONFIRM);
          const response = await crossChainMessenger.bridgeNativeToken(
            transaction.amount.toString(),
            {
              recipient: transaction.toAddress || undefined,
            }
          );
          handleChangeTransactionState(TransactionStatusEnum.CONFIRMING);
          const depositTx = await response.wait();
          handleChangeTransactionState(
            TransactionStatusEnum.SUCCESS,
            depositTx.transactionHash
          );
          setIsApproved(false);
        } catch (error) {
          console.error(error);
          handleChangeTransactionState(TransactionStatusEnum.ERROR);
        }
        break;
      default:
        try {
          if (!crossChainMessenger) return;
          handleChangeTransactionState(TransactionStatusEnum.READY_TO_CONFIRM);
          const response = await crossChainMessenger.bridgeERC20(
            transaction.l1Token?.address as AddressLike,
            transaction.l2Token?.address as AddressLike,
            transaction.amount.toString(),
            {
              recipient: transaction.toAddress || undefined,
            }
          );
          handleChangeTransactionState(TransactionStatusEnum.CONFIRMING);
          const depositTx = await response.wait();
          handleChangeTransactionState(
            TransactionStatusEnum.SUCCESS,
            depositTx.transactionHash
          );
          setIsApproved(false);
        } catch (error) {
          console.error(error);
          handleChangeTransactionState(TransactionStatusEnum.ERROR);
        }
        break;
    }
  };

  return { deposit };
};
