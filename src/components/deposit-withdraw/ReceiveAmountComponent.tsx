import { Flex, Text } from "@chakra-ui/react";
import { TokenSymbolComponent } from "../icons/TokenSymbol";

export const ReceiveAmountComponent: React.FC<{
  amount: string;
  tokenSymbol: string;
}> = ({ amount, tokenSymbol }) => {
  return (
    <Flex flexDir={"column"} gap={"6px"}>
      <Text color={"#8C8F97"} fontWeight={400} lineHeight={"22px"}>
        You receive
      </Text>
      <Flex
        justifyContent={"space-between"}
        bgColor={"#1D1F25"}
        borderRadius={"6px"}
        py={"10px"}
        px={"16px"}
        alignItems={"center"}
      >
        <Text fontSize={"16px"}>{amount}</Text>
        <Flex gap={"6px"} alignItems={"center"}>
          <TokenSymbolComponent
            tokenSymbol={tokenSymbol}
            width={20}
            height={20}
          />
          <Text fontSize={"16px"} fontWeight={500} lineHeight={"24px"}>
            {tokenSymbol}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
