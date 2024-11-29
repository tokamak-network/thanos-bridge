import { BridgeModeEnum } from "@/types/bridge";
import { Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { DepositButtonComponent } from "./DepositButton";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { FromToNetworkComponent } from "./FromToNetwork";
import { jotaiBridgeTransactionInfo } from "@/jotai/bridge";

export const DepositWithdrawComponent: React.FC = () => {
  const [transaction] = useAtom(jotaiBridgeTransactionInfo);
  const { isConnected } = useWalletConnect();
  return (
    <Flex flexDir={"column"} gap={"32px"} width={"100%"}>
      <Flex
        bgColor={"#101217"}
        borderRadius={"22px"}
        border={"1px solid #25282F"}
        p={"24px"}
      >
        <FromToNetworkComponent />
      </Flex>
      {transaction.mode === BridgeModeEnum.DEPOSIT && isConnected && (
        <DepositButtonComponent />
      )}
    </Flex>
  );
};
