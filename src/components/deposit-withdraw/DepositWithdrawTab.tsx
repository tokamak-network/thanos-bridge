import { BridgeModeEnum, BridgeTransactionInfo } from "@/types/bridge";
import { Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { Button } from "../ui/button";
import { useNetwork } from "@/hooks/network/useNetwork";
import { useEffect } from "react";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { getChainLayer } from "@/utils/network";
import { ChainLayerEnum } from "@/types/network";
import { jotaiBridgeTransactionInfo } from "@/jotai/bridge";

export const DepositWithdrawTabComponent: React.FC = () => {
  const [transaction, setTransaction] = useAtom(jotaiBridgeTransactionInfo);
  const { switchToL1, switchToL2 } = useNetwork();
  const { chain } = useWalletConnect();
  const handleClick = async (status: BridgeModeEnum) => {
    if (status === transaction.mode) return;
    if (status === BridgeModeEnum.DEPOSIT) {
      await switchToL1();
    } else {
      await switchToL2();
    }
    setTransaction((prev: BridgeTransactionInfo) => ({
      ...prev,
      mode: status,
    }));
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
        color={
          transaction.mode === BridgeModeEnum.DEPOSIT ? "#0070ED" : "#8C8F97"
        }
        fontWeight={500}
        lineHeight={"normal"}
        borderRadius={"32px"}
        border={
          transaction.mode === BridgeModeEnum.DEPOSIT ? "1px solid #0070ED" : ""
        }
        height={"100%"}
        onClick={() => handleClick(BridgeModeEnum.DEPOSIT)}
      >
        Deposit
      </Button>
      <Button
        width={"144px"}
        bgColor={"transparent"}
        fontSize={"18px"}
        color={
          transaction.mode === BridgeModeEnum.WITHDRAW ? "#0070ED" : "#8C8F97"
        }
        fontWeight={500}
        lineHeight={"normal"}
        borderRadius={"32px"}
        border={
          transaction.mode === BridgeModeEnum.WITHDRAW
            ? "1px solid #0070ED"
            : ""
        }
        height={"100%"}
        onClick={() => handleClick(BridgeModeEnum.WITHDRAW)}
      >
        Withdraw
      </Button>
    </Flex>
  );
};
