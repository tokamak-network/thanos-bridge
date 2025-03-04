"use client";

import { Flex, Text } from "@chakra-ui/react";
import { ConnectedNetworkAccount } from "../network/ConnectedNetworkAccount";
import dynamic from "next/dynamic";
import LogoIcon from "@/assets/icons/logo.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { USER_GUIDE_URL } from "@/constants/urls";

const GNBComponentInner = () => {
  const router = useRouter();
  const pathname = usePathname();
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
      <Flex gap={"40px"} alignItems={"center"}>
        <Link href={USER_GUIDE_URL} target="_blank" rel="noopener noreferrer">
          <Text
            fontSize={"16px"}
            fontWeight={500}
            lineHeight={"24px"}
            color={"#FFFFFF"}
            cursor={"pointer"}
            _hover={{
              color: "#0070ED",
            }}
          >
            User Guide
          </Text>
        </Link>
        <Text
          fontSize={"16px"}
          fontWeight={500}
          lineHeight={"24px"}
          color={pathname === "/bridge-info" ? "#0070ED" : "#FFFFFF"}
          cursor={"pointer"}
          _hover={{
            color: "#0070ED",
          }}
          onClick={() => router.push("/bridge-info")}
        >
          Bridge Info
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
