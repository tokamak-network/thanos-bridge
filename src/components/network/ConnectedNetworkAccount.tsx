"use client";

import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { Account } from "../wallet-connect/Account";
import { ConnectedNetwork } from "./ConnectedNetwork";
import { NetworkSwitcher } from "./NetworkSwitcher";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";

export const ConnectedNetworkAccount: React.FC = () => {
  const [isNetworkDropdownOpened, setIsNetworkDropdownOpened] =
    useState<boolean>(false);
  const { isConnected } = useWalletConnect();
  return (
    <Flex alignItems={"flex-start"} flexDir={"column"} gap={"8px"}>
      <Flex gap={"12px"}>
        {isConnected && (
          <ConnectedNetwork
            onClick={() => {
              setIsNetworkDropdownOpened((prev) => !prev);
            }}
          />
        )}
        <Account />
      </Flex>
      {isNetworkDropdownOpened && (
        <NetworkSwitcher
          onClick={() => {
            setIsNetworkDropdownOpened(false);
          }}
        />
      )}
    </Flex>
  );
};
