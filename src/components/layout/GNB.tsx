"use client";

import { Flex, Text } from "@chakra-ui/react";
import { ConnectedNetworkAccount } from "../network/ConnectedNetworkAccount";
import dynamic from "next/dynamic";
import LogoIcon from "@/assets/icons/logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const GNBComponentInner = () => {
  const router = useRouter();

  return (
    <Flex
      height={"80px"}
      position={"relative"}
      justifyContent={"center"}
      alignItems={"center"}
      px={"32px"}
      py={"20px"}
    >
      <Flex position={"absolute"} left={"32px"} top={"20px"}>
        <Flex
          px="16px"
          py="8px"
          gap={"8px"}
          cursor={"pointer"}
          onClick={() => router.push("/")}
        >
          <Flex>
            <Image src={LogoIcon} alt="logo" width={20} height={20} />
          </Flex>
          <Text
            fontSize={"16px"}
            fontWeight={500}
            lineHeight={"24px"}
            color={"#FFFFFF"}
          >
            Bridge
          </Text>
        </Flex>
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
