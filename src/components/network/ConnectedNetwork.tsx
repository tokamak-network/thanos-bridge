"use client";
import { Flex } from "@chakra-ui/react";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import Image from "next/image";
import { Button } from "../ui/button";
import WrongNetworkIcon from "@/assets/icons/network/wrong-network.svg";
import L1NetworkIcon from "@/assets/icons/network/l1-network.svg";
import L2NetworkIcon from "@/assets/icons/network/l2-network.svg";
import dynamic from "next/dynamic";
import { getChainLayer } from "@/utils/network";
import { useMemo } from "react";
import { ChainLayerEnum } from "@/types/network";
import { MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { NetworkListComponent } from "./NetworkList";
import { useNetwork } from "@/hooks/network/useNetwork";
import { l1Chain } from "@/config/network";

const ConnectedNetworkComponent: React.FC = () => {
  const { chain, isConnected } = useWalletConnect();
  const chainLayer = useMemo(() => {
    if (!chain) return ChainLayerEnum.L1;
    return getChainLayer(chain.id);
  }, [chain]);
  const { switchChain } = useNetwork();
  const handleNetworkSelect = async (chainId: number) => {
    try {
      if (isConnected) await switchChain(chainId);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          px={"12px"}
          py={"8px"}
          bgColor={"#101217"}
          borderRadius={"8px"}
          border={"1px solid #25282F"}
          _hover={{ border: "1px solid #555A64" }}
          height={"46px"}
          fontWeight={500}
          fontSize={"16px"}
          lineHeight={"24px"}
        >
          <Flex gap={"8px"} alignItems={"center"}>
            {chainLayer === ChainLayerEnum.L1 && (
              <Image src={L1NetworkIcon} alt="l1" width={24} height={24} />
            )}
            {chainLayer === ChainLayerEnum.L2 && (
              <Image src={L2NetworkIcon} alt="l2" width={24} height={24} />
            )}
            {chainLayer === ChainLayerEnum.UNKNOWN && (
              <Image
                src={WrongNetworkIcon}
                alt="unknown"
                width={24}
                height={24}
              />
            )}
            {chain?.name ?? l1Chain.name}
          </Flex>
        </Button>
      </MenuTrigger>
      <NetworkListComponent onSelectNetwork={handleNetworkSelect} />
    </MenuRoot>
  );
};

export const ConnectedNetwork = dynamic(
  () => Promise.resolve(ConnectedNetworkComponent),
  { ssr: false }
);
