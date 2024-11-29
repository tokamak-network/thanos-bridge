"use client";

import { Flex } from "@chakra-ui/react";
import React from "react";
import { Account } from "../wallet-connect/Account";
import { ConnectedNetwork } from "./ConnectedNetwork";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";

export const ConnectedNetworkAccount: React.FC = () => {
  const { isConnected } = useWalletConnect();

  return (
    <Flex alignItems={"flex-start"} flexDir={"column"} gap={"8px"}>
      <Flex gap={"12px"}>
        {isConnected && <ConnectedNetwork />}
        <Account />
      </Flex>
    </Flex>
  );
};
