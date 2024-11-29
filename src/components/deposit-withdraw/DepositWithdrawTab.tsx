import { bridgeStatus } from "@/jotai/bridge";
import { BridgeEnum } from "@/types/bridge";
import { Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { Button } from "../ui/button";
import { useNetwork } from "@/hooks/network/useNetwork";

export const DepositWithdrawTabComponent: React.FC = () => {
  const [status, setStatus] = useAtom(bridgeStatus);
  const { switchToL1, switchToL2 } = useNetwork();
  const handleClick = async (status: BridgeEnum) => {
    if (status === BridgeEnum.DEPOSIT) {
      await switchToL1();
    } else {
      await switchToL2();
    }
    setStatus(status);
  };

  return (
    <Flex
      width={"288px"}
      height={"48px"}
      borderRadius={"32px"}
      border={"1px solid #25282F"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Button
        width={"144px"}
        bgColor={"transparent"}
        fontSize={"18px"}
        color={status === BridgeEnum.DEPOSIT ? "#0070ED" : "#8C8F97"}
        fontWeight={500}
        lineHeight={"normal"}
        borderRadius={"32px"}
        border={status === BridgeEnum.DEPOSIT ? "1px solid #0070ED" : ""}
        height={"100%"}
        onClick={() => handleClick(BridgeEnum.DEPOSIT)}
      >
        Deposit
      </Button>
      <Button
        width={"144px"}
        bgColor={"transparent"}
        fontSize={"18px"}
        color={status === BridgeEnum.WITHDRAW ? "#0070ED" : "#8C8F97"}
        fontWeight={500}
        lineHeight={"normal"}
        borderRadius={"32px"}
        border={status === BridgeEnum.WITHDRAW ? "1px solid #0070ED" : ""}
        height={"100%"}
        onClick={() => handleClick(BridgeEnum.WITHDRAW)}
      >
        Withdraw
      </Button>
    </Flex>
  );
};
