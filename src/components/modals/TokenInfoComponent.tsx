import { Flex, Text } from "@chakra-ui/react";
import { TokenSymbolComponent } from "../icons/TokenSymbol";
import { Button } from "../ui/button";
import { Token, TokenBalance } from "@/types/token";
import { useEffect, useState } from "react";
import {
  getTokenBalanceByChainId,
  trimTokenBalance,
} from "@/utils/token-balance";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";

interface ITokenInfoComponentProps {
  token: Token;
  onClick: (token: Token) => void;
}

export const TokenInfoComponent: React.FC<ITokenInfoComponentProps> = ({
  token,
  onClick,
}) => {
  const [balance, setBalance] = useState<TokenBalance | null>(null);
  const { address, isConnected } = useWalletConnect();
  useEffect(() => {
    if (!isConnected) return;
    getTokenBalanceByChainId(
      address as `0x${string}`,
      token.chainId,
      token.address
    ).then((balance) => {
      setBalance(balance);
    });
  }, [token, setBalance, address, isConnected]);
  return (
    <Button
      width={"372px"}
      alignItems={"center"}
      justifyContent={"space-between"}
      bgColor={"#25282F"}
      borderRadius={"12px"}
      padding={"16px"}
      _hover={{ bgColor: "#383C44" }}
      cursor={"pointer"}
      onClick={() => {
        onClick(token);
      }}
      height={"80px"}
    >
      <Flex alignItems={"center"} gap={"12px"}>
        <TokenSymbolComponent
          tokenSymbol={token.symbol}
          width={40}
          height={40}
        />
        <Flex flexDir={"column"} alignItems={"flex-start"}>
          <Text fontSize={"18px"} fontWeight={600} lineHeight={"normal"}>
            {token.symbol}
          </Text>
          <Text color={"#8C8F97"}>{token.name}</Text>
        </Flex>
      </Flex>
      <Text fontSize={"18px"} lineHeight={"24px"}>
        {trimTokenBalance(balance?.formatted ?? "0", 4)}
      </Text>
    </Button>
  );
};
