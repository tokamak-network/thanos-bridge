"use client";

import { Account } from "@/components/wallet-connect/Account";
import { Flex, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { ConnectedNetwork } from "../network/ConnectedNetwork";
export const GNBComponent = () => {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <Flex
      height={"80px"}
      position={"relative"}
      justifyContent={"center"}
      alignItems={"center"}
      px={"32px"}
      py={"20px"}
    >
      <Flex gap={"48px"}>
        <Text
          fontSize={"16px"}
          fontWeight={500}
          lineHeight={"24px"}
          cursor={"pointer"}
          color={pathName.includes("bridge") ? "#FFFFFF" : "#8C8F97"}
          onClick={() => router.push("/bridge")}
        >
          Bridge
        </Text>
        <Text
          fontSize={"16px"}
          fontWeight={500}
          lineHeight={"24px"}
          cursor={"pointer"}
          color={pathName.includes("account") ? "#FFFFFF" : "#8C8F97"}
          onClick={() => router.push("/account")}
        >
          Account
        </Text>
      </Flex>
      <Flex gap={"12px"} position={"absolute"} right={"32px"}>
        <ConnectedNetwork />
        <Account />
      </Flex>
    </Flex>
  );
};
