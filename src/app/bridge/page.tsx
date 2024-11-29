"use client";

import { DepositWithdrawComponent } from "@/components/deposit-withdraw/DepositWithdrawComponent";
import { DepositWithdrawTabComponent } from "@/components/deposit-withdraw/DepositWithdrawTab";
import { WalletConnectButtonComponent } from "@/components/wallet-connect/WalletConnectButton";
import { l1Chain, l2Chain } from "@/config/network";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { jotaiBridgeTransactionInfo } from "@/jotai/bridge";
import { BridgeModeEnum } from "@/types/bridge";
import { Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const BridgePageContent: React.FC = () => {
  const { isConnected } = useWalletConnect();
  const [transaction, setTransaction] = useAtom(jotaiBridgeTransactionInfo);
  useEffect(() => {
    if (transaction.mode === BridgeModeEnum.DEPOSIT) {
      setTransaction((prev) => ({
        ...prev,
        fromChain: l1Chain,
        toChain: l2Chain,
      }));
    } else {
      setTransaction((prev) => ({
        ...prev,
        fromChain: l2Chain,
        toChain: l1Chain,
      }));
    }
  }, [transaction.mode, setTransaction]);
  return (
    <Flex w={"100%"} justifyContent={"center"}>
      <Flex
        w={"488px"}
        mt={"48px"}
        gap={"40px"}
        flexDir={"column"}
        alignItems={"center"}
      >
        <DepositWithdrawTabComponent />
        <Flex gap={"32px"} width={"100%"} flexDir={"column"}>
          <DepositWithdrawComponent />
          {!isConnected && <WalletConnectButtonComponent />}
        </Flex>
      </Flex>
    </Flex>
  );
};

const BridgePage = dynamic(() => Promise.resolve(BridgePageContent), {
  ssr: false,
});

export default BridgePage;
