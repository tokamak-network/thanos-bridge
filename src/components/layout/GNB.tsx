"use client";

import { Flex, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { ConnectedNetworkAccount } from "../network/ConnectedNetworkAccount";
import dynamic from "next/dynamic";

const GNBComponentInner = () => {
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
      <Flex position={"absolute"} right={"32px"} top={"20px"}>
        <ConnectedNetworkAccount />
      </Flex>
    </Flex>
  );
};

export const GNBComponent = dynamic(() => Promise.resolve(GNBComponentInner), {
  ssr: false,
});
