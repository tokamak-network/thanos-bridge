"use client";
import MetamaskIcon from "@/assets/icons/network/metamask.svg";
import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Connector } from "wagmi";
import { Button } from "../ui/button";

interface WalletOptionProps {
  connector: Connector;
  onClick: () => void;
}

export const WalletOption: React.FC<WalletOptionProps> = (props) => {
  const { connector, onClick } = props;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <Button
      h={"72px"}
      p={"16px"}
      borderRadius={"12px"}
      bg={"#25282F"}
      _hover={{ bg: "#383C44" }}
      cursor={"pointer"}
      onClick={onClick}
      disabled={!ready}
      justifyContent={"flex-start"}
    >
      <Flex gap={"12px"} alignItems={"center"}>
        {connector.icon ? (
          <img
            src={connector.icon}
            alt={connector.name}
            width={40}
            height={40}
            style={{ borderRadius: 8 }}
          />
        ) : (
          <Image src={MetamaskIcon} alt={connector.name} width={40} height={40} />
        )}
        <Text fontSize={"18px"} fontWeight={"600"} lineHeight={"24px"}>
          {connector.name}
        </Text>
      </Flex>
    </Button>
  );
};
