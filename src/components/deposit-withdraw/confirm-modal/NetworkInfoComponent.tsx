import { ArrowRightIconComponent } from "@/components/icons/ArrowRight";
import { NetworkSymbolComponent } from "@/components/icons/NetworkSymbol";
import { BridgeModeEnum } from "@/types/bridge";
import { ChainLayerEnum } from "@/types/network";
import { Flex, Text } from "@chakra-ui/react";
interface INetworkInfoComponentProps {
  mode: BridgeModeEnum;
  fromNetwork: string;
  toNetwork: string;
}

export const NetworkInfoComponent: React.FC<INetworkInfoComponentProps> = (
  props
) => {
  const { mode, fromNetwork, toNetwork } = props;
  const fromNetworkLayer =
    mode === BridgeModeEnum.DEPOSIT ? ChainLayerEnum.L1 : ChainLayerEnum.L2;
  const toNetworkLayer =
    mode === BridgeModeEnum.DEPOSIT ? ChainLayerEnum.L2 : ChainLayerEnum.L1;
  return (
    <Flex
      bgColor={"#1D1F25"}
      borderRadius={"6px"}
      px={"16px"}
      py={"12px"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Text color={"#8C8F97"} fontSize={"16px"} lineHeight={"24px"}>
        Network
      </Text>
      <Flex alignItems={"center"} gap={"8px"}>
        <Flex alignItems={"center"} gap={"6px"}>
          <NetworkSymbolComponent
            width={20}
            height={20}
            networkLayer={fromNetworkLayer}
          />
          <Text fontSize={"16px"} fontWeight={500} lineHeight={"normal"}>
            {fromNetwork}
          </Text>
        </Flex>
        <ArrowRightIconComponent width={16} height={16} />
        <Flex alignItems={"center"} gap={"6px"}>
          <NetworkSymbolComponent
            width={20}
            height={20}
            networkLayer={toNetworkLayer}
          />
          <Text fontSize={"16px"} fontWeight={500} lineHeight={"normal"}>
            {toNetwork}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
