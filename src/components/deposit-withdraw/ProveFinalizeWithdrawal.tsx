import { BridgingStepEnum } from "@/types/bridge";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React from "react";
interface IProveFinalizeWithdrawalComponentProps {
  initiateTxHash: string;
  onChange: (value: string) => void;
  isValid: boolean;
  step: BridgingStepEnum;
  isReadyToProveOrFinalize: boolean;
  isVerifyingTxHash: boolean;
}
export const ProveFinalizeWithdrawalComponent: React.FC<
  IProveFinalizeWithdrawalComponentProps
> = ({
  initiateTxHash,
  onChange,
  isValid,
  step,
  isReadyToProveOrFinalize,
  isVerifyingTxHash,
}) => {
  const onImportClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const lines = content.split("\n");

          for (const line of lines) {
            if (line.startsWith("Transaction Hash: ")) {
              onChange(line.split(": ")[1].trim());
            }
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  };
  return (
    <Flex flexDir={"column"} gap={"6px"}>
      <Text color={"#8C8F97"} lineHeight={"22px"}>
        Initiate txn
      </Text>
      <Flex gap={"6px"}>
        <Input
          truncate
          width={"100%"}
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
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        <Button
          color={"#FFF"}
          bgColor={"#0070ED"}
          px={"16px"}
          onClick={onImportClick}
        >
          Import
        </Button>
      </Flex>
      {!isValid && (
        <Text color={"#DD3A44"}>Please enter a valid transaction hash.</Text>
      )}
      {!isVerifyingTxHash &&
        isValid &&
        initiateTxHash &&
        !isReadyToProveOrFinalize && (
          <Text color={"#DD3A44"}>
            {step === BridgingStepEnum.PROVE
              ? "The transaction is not ready to be proved."
              : "The transaction is not ready for finalize."}
          </Text>
        )}
      {isVerifyingTxHash && (
        <Text color={"#8C8F97"}>Verifying transaction hash...</Text>
      )}
    </Flex>
  );
};
