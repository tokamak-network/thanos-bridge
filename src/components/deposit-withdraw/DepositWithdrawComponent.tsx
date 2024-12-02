"use client";
import { BridgeModeEnum } from "@/types/bridge";
import { Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { DepositButtonComponent } from "./DepositButton";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { FromToNetworkComponent } from "./FromToNetwork";
import { jotaiBridgeTransactionInfo } from "@/jotai/bridge";
import { ToAddressComponent } from "./ToAddressComponent";
import { TokenInputComponent } from "./TokenInputComponent";
import { getParsedAmount } from "@/utils/token-balance";
import { ReceiveAmountComponent } from "./ReceiveAmountComponent";
import { getBridgeToken } from "@/utils/bridge";

export const DepositWithdrawComponent: React.FC = () => {
  const [transaction] = useAtom(jotaiBridgeTransactionInfo);
  const { isConnected } = useWalletConnect();
  const isAvailableToDeposit =
    transaction.formatted !== "" && getParsedAmount(transaction.formatted, 18);
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
        {transaction.amount && (
          <ReceiveAmountComponent
            amount={transaction.formatted}
            tokenSymbol={getBridgeToken(transaction)?.symbol ?? ""}
          />
        )}
        <ToAddressComponent />
      </Flex>
      {transaction.mode === BridgeModeEnum.DEPOSIT && isConnected && (
        <DepositButtonComponent disabled={!isAvailableToDeposit} />
      )}
    </Flex>
  );
};
