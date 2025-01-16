import { TokenSymbolComponent } from "@/components/icons/TokenSymbol";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { BridgeTransactionInfo } from "@/types/bridge";
import { trimAddress } from "@/utils/address";
import { trimTokenBalance } from "@/utils/token-balance";
import { Box, Flex, Text } from "@chakra-ui/react";

interface ITransactionDetailComponentProps {
  transaction: BridgeTransactionInfo;
}

export const TransactionDetailComponent: React.FC<
  ITransactionDetailComponentProps
> = ({ transaction }) => {
  const { address } = useWalletConnect();
  return (
    <Flex flexDir={"column"} gap={"8px"}>
      <Flex
        bgColor={"#1D1F25"}
        px={"16px"}
        py={"12px"}
        borderRadius={"6px"}
        flexDir={"column"}
        gap={"8px"}
      >
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Text color={"#8C8F97"} fontSize={"16px"} lineHeight={"24px"}>
            Send
          </Text>
          <Flex alignItems={"center"} gap={"12px"}>
            <Text fontSize={"16px"} fontWeight={600} lineHeight={"24px"}>
              {trimTokenBalance(transaction.formatted, 2)}
            </Text>
            <Flex alignItems={"center"} gap={"6px"}>
              <TokenSymbolComponent
                tokenSymbol={transaction.l1Token?.symbol || ""}
                width={20}
                height={20}
              />
              <Text fontSize={"16px"} fontWeight={600} lineHeight={"24px"}>
                {transaction.l1Token?.symbol || ""}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box height={"1px"} width={"100%"} bgColor={"#25282F"} />
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Text color={"#8C8F97"} fontSize={"16px"} lineHeight={"24px"}>
            Receive
          </Text>
          <Flex alignItems={"center"} gap={"12px"}>
            <Text fontSize={"16px"} fontWeight={600} lineHeight={"24px"}>
              {trimTokenBalance(transaction.formatted, 2)}
            </Text>
            <Flex alignItems={"center"} gap={"6px"}>
              <TokenSymbolComponent
                tokenSymbol={transaction.l2Token?.symbol || ""}
                width={20}
                height={20}
              />
              <Text fontSize={"16px"} fontWeight={600} lineHeight={"24px"}>
                {transaction.l2Token?.symbol || ""}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        bgColor={"#1D1F25"}
        px={"16px"}
        py={"12px"}
        borderRadius={"6px"}
        flexDir={"column"}
        gap={"8px"}
      >
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Text color={"#8C8F97"} fontSize={"16px"} lineHeight={"24px"}>
            From address
          </Text>
          <Text fontSize={"16px"} fontWeight={600} lineHeight={"24px"}>
            {trimAddress({ address: transaction.fromAddress, firstChar: 7 })}
          </Text>
        </Flex>
        <Box height={"1px"} width={"100%"} bgColor={"#25282F"} />
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Text color={"#8C8F97"} fontSize={"16px"} lineHeight={"24px"}>
            To address
          </Text>
          <Text fontSize={"16px"} fontWeight={600} lineHeight={"24px"}>
            {trimAddress({
              address: transaction.toAddress || address,
              firstChar: 7,
            })}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
