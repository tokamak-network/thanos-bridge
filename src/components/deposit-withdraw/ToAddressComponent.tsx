"use client";
import { Flex, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Input } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { jotaiBridgeTransactionInfo } from "@/jotai/bridge";
import { isValidEthereumAddress } from "@/utils/address";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";

export const ToAddressComponent: React.FC = () => {
  const [transaction, setTransaction] = useAtom(jotaiBridgeTransactionInfo);
  const { address, isConnected } = useWalletConnect();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransaction((prev) => ({
      ...prev,
      toAddress: e.target.value,
    }));
  };
  const isValid = useMemo(
    () => isValidEthereumAddress(transaction.toAddress ?? ""),
    [transaction.toAddress, isValidEthereumAddress]
  );
  const isConnectedAddress = useMemo(() => {
    return isConnected && address === transaction.toAddress;
  }, [address, transaction.toAddress, isConnected]);
  return (
    <Flex gap={"6px"} flexDir={"column"}>
      <Text color={"#8C8F97"} fontWeight={400}>
        To address
      </Text>
      <Input
        fontSize={"16px"}
        px={"16px"}
        py={"10px"}
        borderRadius={"6px"}
        bgColor={"1D1F25"}
        placeholder="0x012346ac7A6702Bb1852676f3f22AeE38bD442E4C"
        border={
          !isValid && transaction.toAddress
            ? "1px solid #DD3A44"
            : "1px solid #25282F"
        }
        onChange={handleChange}
        value={transaction.toAddress}
      />
      {!isValid && transaction.toAddress && (
        <Text color={"#DD3A44"} fontWeight={400}>
          Please enter a valid wallet address
        </Text>
      )}
      {isValid && isConnectedAddress && (
        <Text color={"#03D187"} fontWeight={400}>
          This is your connected wallet address
        </Text>
      )}
      {isValid && !isConnectedAddress && (
        <Text color={"#F9C03E"} fontWeight={400}>
          This is your connected wallet address
        </Text>
      )}
    </Flex>
  );
};
