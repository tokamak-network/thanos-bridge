"use client";

import { Flex } from "@chakra-ui/react";
import { l1Chain, l2Chain } from "@/config/network";
import { Button } from "../ui/button";
import { Chain } from "wagmi/chains";
import L1NetworkIcon from "@/assets/icons/network/l1-network.svg";
import L2NetworkIcon from "@/assets/icons/network/l2-network.svg";
import Image from "next/image";
import { ChainLayerEnum } from "@/types/network";
import { getChainLayer } from "@/utils/network";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";

interface INetworkSwitcherProps {
  onClick: () => void;
}

export const NetworkSwitcher: React.FC<INetworkSwitcherProps> = ({
  onClick,
}) => {
  const chains = [l1Chain, l2Chain];
  const { switchChainAsync } = useWalletConnect();
  const handleNetworkClick = async (chainId: number) => {
    if (switchChainAsync) {
      await switchChainAsync({ chainId });
    }
    onClick();
  };
  return (
    <Flex
      flexDir={"column"}
      py={"8px"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      gap={"12px"}
      width={"192px"}
      borderRadius={"6px"}
      bgColor={"#101217"}
      border={"1px solid #25282F"}
    >
      {chains.map((chain: Chain) => (
        <Button
          key={chain.id}
          width={"100%"}
          px={"12px"}
          py={"4px"}
          fontSize={"14px"}
          fontWeight={500}
          bgColor={"transparent"}
          _hover={{ bgColor: "#383736" }}
          justifyContent={"flex-start"}
          onClick={() => handleNetworkClick(chain.id)}
        >
          <Flex gap={"8px"} alignItems={"center"}>
            {getChainLayer(chain.id) === ChainLayerEnum.L1 && (
              <Image src={L1NetworkIcon} alt="l1" width={24} height={24} />
            )}
            {getChainLayer(chain.id) === ChainLayerEnum.L2 && (
              <Image src={L2NetworkIcon} alt="l2" width={24} height={24} />
            )}
            {chain.name}
          </Flex>
        </Button>
      ))}
    </Flex>
  );
};
