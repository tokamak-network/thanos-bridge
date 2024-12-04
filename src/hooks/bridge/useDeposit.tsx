import { BridgeTokenEnum, BridgeTransactionInfo } from "@/types/bridge";
import { useThanosSDK } from "./useThanosSDK";
import { l1Chain, l2Chain } from "@/config/network";
import { TransactionStatusEnum } from "@/types/transaction";

export const useDeposit = () => {
  const { crossChainMessenger } = useThanosSDK(l1Chain.id, l2Chain.id);
  const deposit = async (
    transaction: BridgeTransactionInfo,
    handleChangeTransactionState: (
      status: TransactionStatusEnum,
      txHash?: string
    ) => void
  ) => {
    switch (transaction.bridgeTokenType) {
      case BridgeTokenEnum.ETH:
        try {
          if (!crossChainMessenger) return;
          handleChangeTransactionState(TransactionStatusEnum.READY_TO_CONFIRM);
          const response = await crossChainMessenger.bridgeETH(
            transaction.amount.toString(),
            {
              recipient: transaction.toAddress,
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
        break;
      case BridgeTokenEnum.ERC_20:
        break;
      default:
        return;
    }
  };

  return { deposit };
};
