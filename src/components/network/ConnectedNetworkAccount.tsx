"use client";

import { Flex } from "@chakra-ui/react";
import React from "react";
import { Account } from "../wallet-connect/Account";
import { ConnectedNetwork } from "./ConnectedNetwork";

export const ConnectedNetworkAccount: React.FC = () => {
  return (
    <Flex alignItems={"flex-start"} flexDir={"column"} gap={"8px"}>
      <Flex gap={"12px"}>
        <ConnectedNetwork />
        <Account />
      </Flex>
    </Flex>
  );
};
