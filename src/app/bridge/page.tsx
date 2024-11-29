"use client";

import { DepositWithdrawTabComponent } from "@/components/deposit-withdraw/DepositWithdrawTab";
import { Flex } from "@chakra-ui/react";

const BridgePage: React.FC = () => {
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
      </Flex>
    </Flex>
  );
};

export default BridgePage;
