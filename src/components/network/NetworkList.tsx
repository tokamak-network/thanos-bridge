"use client";

import { Flex } from "@chakra-ui/react";
import { l1Chain, l2Chain } from "@/config/network";
import { Chain } from "wagmi/chains";
import L1NetworkIcon from "@/assets/icons/network/l1-network.svg";
import L2NetworkIcon from "@/assets/icons/network/l2-network.svg";
import Image from "next/image";
import { ChainLayerEnum } from "@/types/network";
import { getChainLayer } from "@/utils/network";
import { MenuContent, MenuItem } from "../ui/menu";

interface INetworkListComponentProps {
  onSelectNetwork: (chainId: number) => Promise<void>;
}

export const NetworkListComponent: React.FC<INetworkListComponentProps> = ({
  onSelectNetwork,
}) => {
  const chains = [l1Chain, l2Chain];
  return (
    <MenuContent
      display={"flex"}
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
        <MenuItem
          key={chain.id}
          onClick={async () => {
            await onSelectNetwork(chain.id);
          }}
          value={chain.name}
          width={"192px"}
          height={"40px"}
          px={"12px"}
          py={"6px"}
          fontSize={"14px"}
          fontWeight={500}
          bgColor={"transparent"}
          _hover={{ bgColor: "#1D1F25" }}
          justifyContent={"flex-start"}
          color={"#FFFFFF"}
          cursor={"pointer"}
        >
          <Flex gap={"8px"} alignItems={"center"}>
            {getChainLayer(chain.id) === ChainLayerEnum.L1 && (
              <Image src={L1NetworkIcon} alt="l1" width={20} height={20} />
            )}
            {getChainLayer(chain.id) === ChainLayerEnum.L2 && (
              <Image src={L2NetworkIcon} alt="l2" width={20} height={20} />
            )}
            {chain.name}
          </Flex>
        </MenuItem>
      ))}
    </MenuContent>
  );
};
