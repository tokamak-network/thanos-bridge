import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Button } from "../ui/button";
import ArrowDownIcon from "@/assets/icons/arrow/arrow-down.svg";
import Image from "next/image";
import { useAtom } from "jotai";
import { jotaiBridgeTransactionInfo } from "@/jotai/bridge";
import L1NetworkIcon from "@/assets/icons/network/l1-network.svg";
import L2NetworkIcon from "@/assets/icons/network/l2-network.svg";
import { getChainLayer } from "@/utils/network";
import { ChainLayerEnum } from "@/types/network";
import ArrowLeftIcon from "@/assets/icons/arrow/arrow-left.svg";
import { MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { NetworkListComponent } from "../network/NetworkList";
import { l1Chain, l2Chain } from "@/config/network";
import { useNetwork } from "@/hooks/network/useNetwork";

export const FromToNetworkComponent: React.FC = () => {
  const [transaction] = useAtom(jotaiBridgeTransactionInfo);
  const { switchChain } = useNetwork();
  const handleSelectFromNetwork = async (chainId: number) => {
    switchChain(chainId);
  };
  const handleSelectToNetwork = async (chainId: number) => {
    switchChain(chainId === l1Chain.id ? l2Chain.id : l1Chain.id);
  };
  return (
    <Flex gap={"6px"} alignItems={"flex-end"}>
      <Flex
        flexDir={"column"}
        gap={"6px"}
        justifyContent={"flex-start"}
        bgColor={"1D1F25"}
        width={"192px"}
      >
        <Text
          fontSize={"14px"}
          color={"#8C8F97"}
          fontWeight={400}
          lineHeight={"22px"}
        >
          From
        </Text>
        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              px={"12px"}
              py={"10px"}
              borderRadius={"6px"}
              border={"1px solid #25282F"}
            >
              <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Flex gap={"8px"} alignItems={"center"}>
                  {getChainLayer(transaction.fromChain.id) ===
                    ChainLayerEnum.L1 && (
                    <Image
                      src={L1NetworkIcon}
                      alt="l1"
                      width={24}
                      height={24}
                    />
                  )}
                  {getChainLayer(transaction.fromChain.id) ===
                    ChainLayerEnum.L2 && (
                    <Image
                      src={L2NetworkIcon}
                      alt="l2"
                      width={24}
                      height={24}
                    />
                  )}
                  <Text
                    fontSize={"16px"}
                    fontWeight={500}
                    lineHeight={"normal"}
                  >
                    {transaction.fromChain.name}
                  </Text>
                </Flex>
                <Image
                  src={ArrowDownIcon}
                  alt={"Arrow down icon"}
                  width={14}
                  height={14}
                />
              </Flex>
            </Button>
          </MenuTrigger>
          <NetworkListComponent onSelectNetwork={handleSelectFromNetwork} />
        </MenuRoot>
      </Flex>
      <Button
        bgColor={"1D1F25"}
        borderRadius={"6px"}
        border={"1px solid #25282F"}
      >
        <Image src={ArrowLeftIcon} alt="arrow left" />
      </Button>
      <Flex
        flexDir={"column"}
        gap={"6px"}
        justifyContent={"flex-start"}
        bgColor={"1D1F25"}
        width={"192px"}
      >
        <Text
          fontSize={"14px"}
          color={"#8C8F97"}
          fontWeight={400}
          lineHeight={"22px"}
        >
          To
        </Text>
        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              px={"12px"}
              py={"10px"}
              borderRadius={"6px"}
              border={"1px solid #25282F"}
            >
              <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Flex gap={"8px"} alignItems={"center"}>
                  {getChainLayer(transaction.toChain.id) ===
                    ChainLayerEnum.L1 && (
                    <Image
                      src={L1NetworkIcon}
                      alt="l1"
                      width={24}
                      height={24}
                    />
                  )}
                  {getChainLayer(transaction.toChain.id) ===
                    ChainLayerEnum.L2 && (
                    <Image
                      src={L2NetworkIcon}
                      alt="l2"
                      width={24}
                      height={24}
                    />
                  )}
                  <Text
                    fontSize={"16px"}
                    fontWeight={500}
                    lineHeight={"normal"}
                  >
                    {transaction.toChain.name}
                  </Text>
                </Flex>
                <Image
                  src={ArrowDownIcon}
                  alt={"Arrow down icon"}
                  width={14}
                  height={14}
                />
              </Flex>
            </Button>
          </MenuTrigger>
          <NetworkListComponent onSelectNetwork={handleSelectToNetwork} />
        </MenuRoot>
      </Flex>
    </Flex>
  );
};
