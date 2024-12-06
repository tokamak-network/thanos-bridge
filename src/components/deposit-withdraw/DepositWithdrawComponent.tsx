"use client";
import {
  BridgeModeEnum,
  BridgeTokenEnum,
  BridgeTransactionInfo,
} from "@/types/bridge";
import { Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { BigButtonComponent } from "../ui/BigButton";
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
import { getBridgeToken, isValidTxHash } from "@/utils/bridge";
import { useEffect, useState } from "react";
import { DepositWithdrawConfirmModal } from "./confirm-modal/DepositWithdrawConfirmModal";
import { useDeposit } from "@/hooks/bridge/useDeposit";
import { TransactionStatusEnum } from "@/types/transaction";
import { useApprove } from "@/hooks/bridge/useApprove";
import { useWithdraw } from "@/hooks/bridge/useWithdraw";
import { WithdrawStepEnum } from "../../types/bridge";
import { WithdrawStepComponent } from "./WithdrawStep";
import { ProveFinalizeWithdrawalComponent } from "./ProveFinalizeWithdrawal";
import { useNetwork } from "@/hooks/network/useNetwork";
import { l1Chain, l2Chain } from "@/config/network";

export const DepositWithdrawComponent: React.FC = () => {
  const [transaction] = useAtom(jotaiBridgeTransactionInfo);
  const [transactionConfirmModalStatus, setTransactionConfirmModalStatus] =
    useAtom(jotaiTransactionConfirmModalStatus);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isValidInitiateTxHash, setIsValidInitiateTxHash] =
    useState<boolean>(false);
  const [withdrawStep, setWithdrawStep] = useState<WithdrawStepEnum>(
    WithdrawStepEnum.INITIATE
  );
  const [initiateTxHash, setInitiateTxHash] = useState<string>("");
  const { deposit } = useDeposit();
  const { withdraw } = useWithdraw();
  const { approve } = useApprove(setIsApproving, setIsApproved);
  const { switchToL1, switchToL2 } = useNetwork();
  const { chain } = useWalletConnect();
  const { isConnected } = useWalletConnect();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isInsufficient] = useAtom(jotaiIsInsufficient);
  const isAvailableToBridge =
    transaction.formatted !== "" && getParsedAmount(transaction.formatted, 18);
  const needToApprove =
    transaction.mode === BridgeModeEnum.DEPOSIT &&
    transaction.bridgeTokenType !== BridgeTokenEnum.ETH;
  useEffect(() => {
    if (transaction.bridgeTokenType === BridgeTokenEnum.ETH)
      setIsApproved(true);
    else setIsApproved(false);
  }, [transaction, setIsApproved]);
  useEffect(() => {
    if (transaction.mode === BridgeModeEnum.WITHDRAW)
      setWithdrawStep(WithdrawStepEnum.INITIATE);
  }, [transaction.mode, setWithdrawStep]);
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
  const handleInitiateTxHashChange = (value: string) => {
    setInitiateTxHash(value);
    setIsValidInitiateTxHash(isValidTxHash(value));
  };
  const handleBridge = async (transaction: BridgeTransactionInfo) => {
    setTransactionConfirmModalStatus((prev) => ({
      ...prev,
      status: TransactionStatusEnum.CONFIRMING,
      mode: transaction.mode,
    }));
    if (transaction.mode === BridgeModeEnum.DEPOSIT)
      await deposit(transaction, handleTransactionStateChange, setIsApproved);
    else
      await withdraw(transaction, handleTransactionStateChange, setIsApproved);
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
        {transaction.mode === BridgeModeEnum.WITHDRAW && (
          <WithdrawStepComponent
            step={withdrawStep}
            setStep={setWithdrawStep}
          />
        )}
        {transaction.mode === BridgeModeEnum.WITHDRAW &&
        withdrawStep !== WithdrawStepEnum.INITIATE ? (
          <ProveFinalizeWithdrawalComponent
            isValid={isValidInitiateTxHash || initiateTxHash.length === 0}
            onChange={handleInitiateTxHashChange}
            initiateTxHash={initiateTxHash}
          />
        ) : (
          <>
            <FromToNetworkComponent />
            <TokenInputComponent />
            {transaction.amount && isConnected && (
              <ReceiveAmountComponent
                amount={transaction.formatted}
                tokenSymbol={getBridgeToken(transaction)?.symbol ?? ""}
              />
            )}
            <ToAddressComponent />
          </>
        )}
      </Flex>
      {needToApprove && !isApproved && isConnected && (
        <BigButtonComponent
          disabled={!isAvailableToBridge || isInsufficient}
          content={isInsufficient ? "Insufficient balance" : "Approve"}
          isLoading={isApproving}
          onClick={handleApprove}
        />
      )}
      {transaction.mode === BridgeModeEnum.DEPOSIT &&
        isConnected &&
        isApproved && (
          <BigButtonComponent
            disabled={!isAvailableToBridge || isInsufficient}
            content={isInsufficient ? "Insufficient balance" : "Deposit"}
            onClick={() => setIsConfirmModalOpen(true)}
          />
        )}
      {transaction.mode === BridgeModeEnum.WITHDRAW &&
        withdrawStep === WithdrawStepEnum.INITIATE &&
        isConnected && (
          <BigButtonComponent
            disabled={!isAvailableToBridge || isInsufficient}
            content={isInsufficient ? "Insufficient balance" : "Withdraw"}
            onClick={() => setIsConfirmModalOpen(true)}
          />
        )}
      <DepositWithdrawConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        onClick={async (transaction: BridgeTransactionInfo) =>
          await handleBridge(transaction)
        }
        isLoading={
          transactionConfirmModalStatus.status ===
          TransactionStatusEnum.READY_TO_CONFIRM
        }
      />
    </Flex>
  );
};
