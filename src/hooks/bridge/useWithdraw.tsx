import { BridgeTokenEnum, BridgeTransactionInfo } from "@/types/bridge";
import { useThanosSDK } from "./useThanosSDK";
import { l1Chain, l2Chain } from "@/config/network";
import { TransactionStatusEnum } from "@/types/transaction";
import { AddressLike } from "@tokamak-network/thanos-sdk";
import { useAtom } from "jotai";
import { jotaiGeneralWarningModal } from "@/jotai/bridge";
import { downloadTxHash } from "@/utils/bridge";

export const useWithdraw = () => {
  const { crossChainMessenger } = useThanosSDK(l1Chain.id, l2Chain.id);
  const [, setGeneralWarningModal] = useAtom(jotaiGeneralWarningModal);
  const withdraw = async (
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
          const response = await crossChainMessenger.withdrawETH(
            transaction.amount.toString(),
            {
              recipient: transaction.toAddress || undefined,
            }
          );
          handleChangeTransactionState(TransactionStatusEnum.CONFIRMING);
          const depositTx = await response.wait();
          downloadTxHash(
            l1Chain.name,
            l1Chain.id,
            l2Chain.name,
            l2Chain.id,
            transaction.l1Token?.name || "",
            transaction.formatted,
            depositTx.transactionHash
          );
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
          const response = await crossChainMessenger.withdrawNativeToken(
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
          downloadTxHash(
            l1Chain.name,
            l1Chain.id,
            l2Chain.name,
            l2Chain.id,
            transaction.l1Token?.name || "",
            transaction.formatted,
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
          const response = await crossChainMessenger.withdrawERC20(
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
          downloadTxHash(
            l1Chain.name,
            l1Chain.id,
            l2Chain.name,
            l2Chain.id,
            transaction.l1Token?.name || "",
            transaction.formatted,
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

  const prove = async (
    txHash: string,
    handleChangeTransactionState: (
      status: TransactionStatusEnum,
      txHash?: string
    ) => void
  ) => {
    try {
      if (!crossChainMessenger) return;
      handleChangeTransactionState(TransactionStatusEnum.READY_TO_CONFIRM);
      const response = await crossChainMessenger?.proveMessage(txHash);
      handleChangeTransactionState(TransactionStatusEnum.CONFIRMING);
      const depositTx = await response.wait();
      handleChangeTransactionState(
        TransactionStatusEnum.SUCCESS,
        depositTx.transactionHash
      );
    } catch (error) {
      console.error(error);
      setGeneralWarningModal({
        isOpen: true,
        title: "Prove Error",
        description:
          "The transaction is not ready to prove yet or the hash is not correct.",
      });
      handleChangeTransactionState(TransactionStatusEnum.ERROR);
    }
  };

  const finalize = async (
    txHash: string,
    handleChangeTransactionState: (
      status: TransactionStatusEnum,
      txHash?: string
    ) => void
  ) => {
    try {
      if (!crossChainMessenger) return;
      handleChangeTransactionState(TransactionStatusEnum.READY_TO_CONFIRM);
      const response = await crossChainMessenger?.finalizeMessage(txHash);
      handleChangeTransactionState(TransactionStatusEnum.CONFIRMING);
      const depositTx = await response.wait();
      handleChangeTransactionState(
        TransactionStatusEnum.SUCCESS,
        depositTx.transactionHash
      );
    } catch (error) {
      console.error(error);
      setGeneralWarningModal({
        isOpen: true,
        title: "Finalize Error",
        description:
          "The transaction is not ready to finalize yet or the hash is not correct.",
      });
      handleChangeTransactionState(TransactionStatusEnum.ERROR);
    }
  };

  return { withdraw, prove, finalize };
};
