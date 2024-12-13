import { Flex, Input, Text } from "@chakra-ui/react";
import React from "react";
interface IProveFinalizeWithdrawalComponentProps {
  initiateTxHash: string;
  onChange: (value: string) => void;
  isValid: boolean;
}
export const ProveFinalizeWithdrawalComponent: React.FC<
  IProveFinalizeWithdrawalComponentProps
> = ({ initiateTxHash, onChange, isValid }) => {
  return (
    <Flex flexDir={"column"} gap={"6px"}>
      <Text color={"#8C8F97"} lineHeight={"22px"}>
        Initiate txn
      </Text>
      <Input
        bgColor={"#1D1F25"}
        borderRadius={"6px"}
        _hover={{ border: "1px solid #555A64" }}
        _focus={{ border: "1px solid transparent" }}
        border={!isValid ? "1px solid #DD3A44" : "1px solid transparent"}
        padding={"0px 12px 0px 16px"}
        placeholder={"0x012346ac7A6702Bb1852676f3f22AeE38bD442E4C"}
        fontSize={"16px"}
        color={"454954"}
        value={initiateTxHash}
        onChange={(e) => onChange(e.target.value)}
      />
      {!isValid && <Text color={"#DD3A44"}>Please enter a valid txn</Text>}
    </Flex>
  );
};
