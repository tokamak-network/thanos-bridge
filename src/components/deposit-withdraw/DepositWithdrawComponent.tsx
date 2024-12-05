"use client";
import { BridgeModeEnum, BridgeTokenEnum } from "@/types/bridge";
import { Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { BigButtonComponent } from "./DepositButton";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { FromToNetworkComponent } from "./FromToNetwork";
import {
  jotaiBridgeTransactionInfo,
  jotaiIsInsufficient,
  jotaiTransactionConfirmModalStatus,
} from "@/jotai/bridge";
import { ToAddressComponent } from "./ToAddressComponent";
import { TokenInputComponent } from "./TokenInputComponent";
import { getParsedAmount } from "@/utils/token-balance";
import { ReceiveAmountComponent } from "./ReceiveAmountComponent";
import { getBridgeToken } from "@/utils/bridge";
import { useEffect, useState } from "react";
import { DepositConfirmModal } from "./confirm-modal/DepositConfirmModal";
import { useDeposit } from "@/hooks/bridge/useDeposit";
import { TransactionStatusEnum } from "@/types/transaction";
import { useApprove } from "@/hooks/bridge/useApprove";

export const DepositWithdrawComponent: React.FC = () => {
  const [transaction] = useAtom(jotaiBridgeTransactionInfo);
  const [transactionConfirmModalStatus, setTransactionConfirmModalStatus] =
    useAtom(jotaiTransactionConfirmModalStatus);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { deposit } = useDeposit();
  const { approve } = useApprove(setIsApproving, setIsApproved);
  const { isConnected } = useWalletConnect();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isInsufficient] = useAtom(jotaiIsInsufficient);
  const isAvailableToDeposit =
    transaction.formatted !== "" && getParsedAmount(transaction.formatted, 18);
  const needToApprove =
    transaction.mode === BridgeModeEnum.DEPOSIT &&
    transaction.bridgeTokenType !== BridgeTokenEnum.ETH;
  useEffect(() => {
    if (transaction.bridgeTokenType === BridgeTokenEnum.ETH)
      setIsApproved(true);
    else setIsApproved(false);
  }, [transaction, setIsApproved]);
  const handleTransactionStateChange = (
    status: TransactionStatusEnum,
    txHash?: string
  ) => {
    if (status === TransactionStatusEnum.CONFIRMING) {
      setIsConfirmModalOpen(false);
      setTransactionConfirmModalStatus((prev) => ({
        ...prev,
        isOpen: true,
      }));
    }
    setTransactionConfirmModalStatus((prev) => ({
      ...prev,
      status,
      txHash,
    }));
  };
  const handleDeposit = async () => {
    setTransactionConfirmModalStatus((prev) => ({
      ...prev,
      status: TransactionStatusEnum.CONFIRMING,
      mode: BridgeModeEnum.DEPOSIT,
    }));
    await deposit(transaction, handleTransactionStateChange, setIsApproved);
  };
  const handleApprove = async () => {
    await approve(transaction);
  };
  return (
    <Flex flexDir={"column"} gap={"32px"} width={"100%"}>
      <Flex
        bgColor={"#101217"}
        borderRadius={"22px"}
        border={"1px solid #25282F"}
        p={"24px"}
        gap={"16px"}
        flexDir={"column"}
      >
        <FromToNetworkComponent />
        <TokenInputComponent />
        {transaction.amount && isConnected && (
          <ReceiveAmountComponent
            amount={transaction.formatted}
            tokenSymbol={getBridgeToken(transaction)?.symbol ?? ""}
          />
        )}
        <ToAddressComponent />
      </Flex>
      {needToApprove && !isApproved && isConnected && (
        <BigButtonComponent
          disabled={!isAvailableToDeposit || isInsufficient}
          content={isInsufficient ? "Insufficient balance" : "Approve"}
          isLoading={isApproving}
          onClick={handleApprove}
        />
      )}
      {transaction.mode === BridgeModeEnum.DEPOSIT &&
        isConnected &&
        isApproved && (
          <BigButtonComponent
            disabled={!isAvailableToDeposit || isInsufficient}
            content={isInsufficient ? "Insufficient balance" : "Deposit"}
            onClick={() => setIsConfirmModalOpen(true)}
          />
        )}
      <DepositConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        onClick={async () => await handleDeposit()}
        isLoading={
          transactionConfirmModalStatus.status ===
          TransactionStatusEnum.READY_TO_CONFIRM
        }
      />
    </Flex>
  );
};
