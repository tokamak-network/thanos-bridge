import { BridgingStepEnum } from "@/types/bridge";
import { Flex } from "@chakra-ui/react";
import React from "react";

interface IWithdrawStepComponentProps {
  step: BridgingStepEnum;
  setStep: (step: BridgingStepEnum) => void;
}
export const WithdrawStepComponent: React.FC<IWithdrawStepComponentProps> = ({
  step,
  setStep,
}) => {
  const steps = [
    BridgingStepEnum.INITIATE,
    BridgingStepEnum.PROVE,
    BridgingStepEnum.FINALIZE,
  ];
  return (
    <Flex
      height={"44px"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      {steps.map((sp, index) => {
        const borderRadius =
          index === 0
            ? "6px 0px 0px 6px"
            : index === steps.length - 1
              ? "0px 6px 6px 0px"
              : "";
        return (
          <Flex
            bgColor={sp === step ? "#0070ED" : "#000710"}
            key={sp}
            width={"100%"}
            height={"44px"}
            alignItems={"center"}
            justifyContent={"center"}
            cursor={"pointer"}
            borderRadius={borderRadius}
            borderLeft={`1px solid ${sp !== step ? "#25282F" : "transparent"}`}
            borderRight={
              index === steps.length - 1
                ? `1px solid ${sp !== step ? "#25282F" : "transparent"}`
                : ""
            }
            borderBottom={`1px solid ${sp !== step ? "#25282F" : "transparent"}`}
            borderTop={`1px solid ${sp !== step ? "#25282F" : "transparent"}`}
            onClick={() => setStep(sp)}
          >
            {sp}
          </Flex>
        );
      })}
    </Flex>
  );
};
