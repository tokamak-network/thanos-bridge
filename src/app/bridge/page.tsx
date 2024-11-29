"use client";

import { DepositWithdrawTabComponent } from "@/components/deposit-withdraw/DepositWithdrawTab";
import { WalletConnectButtonComponent } from "@/components/wallet-connect/WalletConnectButton";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const BridgePageContent: React.FC = () => {
  const { isConnected } = useWalletConnect();
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
        <Flex gap={"32px"} width={"100%"}>
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
