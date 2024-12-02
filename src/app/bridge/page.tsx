"use client";

import { DepositWithdrawComponent } from "@/components/deposit-withdraw/DepositWithdrawComponent";
import { DepositWithdrawTabComponent } from "@/components/deposit-withdraw/DepositWithdrawTab";
import { WalletConnectButtonComponent } from "@/components/wallet-connect/WalletConnectButton";
import { useDepositWithdrawInitiate } from "@/hooks/bridge/useDepositWithdrawInitiate";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const BridgePageContent: React.FC = () => {
  const { isConnected } = useWalletConnect();
  useDepositWithdrawInitiate();
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
