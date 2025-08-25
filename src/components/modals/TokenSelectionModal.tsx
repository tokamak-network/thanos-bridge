"use client";
import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Flex, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import {
  jotaiBridgeTransactionInfo,
  jotaiTokenSelectModalOpen,
} from "@/jotai/bridge";
import { useMemo } from "react";
import { getTokenInfoByChainId } from "@/utils/token";
import { Token } from "@/types/token";
import { TokenInfoComponent } from "./TokenInfoComponent";
import { CloseIconComponent } from "../icons/Close";
import { supportedTokens } from "@/constants/token";
import { BridgeModeEnum } from "@/types/bridge";

export const TokenSelectionModalComponent = () => {
  const [transaction, setTransaction] = useAtom(jotaiBridgeTransactionInfo);
  const [isOpen, setIsOpen] = useAtom(jotaiTokenSelectModalOpen);
  const tokenList: Token[] = useMemo(() => {
    return getTokenInfoByChainId(transaction?.fromChain.id);
  }, [transaction?.fromChain]);
  const handleTokenSelected = (token: Token) => {
    setIsOpen(false);
    const token2 = supportedTokens.find(
      (t) =>
        t.chainId !== token.chainId &&
        t.bridgedTokenSymbol === token.bridgedTokenSymbol
    );
    setTransaction((prev) => ({
      ...prev,
      amount: BigInt(0),
      formatted: "",
      l1Token: transaction.mode === BridgeModeEnum.DEPOSIT ? token : token2,
      l2Token: transaction.mode === BridgeModeEnum.DEPOSIT ? token2 : token,
    }));
  };
  return (
    <DialogRoot
      open={isOpen}
      placement={"center"}
      onEscapeKeyDown={() => setIsOpen(false)}
      onInteractOutside={() => setIsOpen(false)}
      onExitComplete={() => setIsOpen(false)}
      onFocusOutside={() => setIsOpen(false)}
    >
      <DialogTrigger></DialogTrigger>
      <DialogContent
        w={"100%"}
        bgColor={"#101217"}
        padding={"24px"}
        borderRadius={"22px"}
        border={"1px solid #25282F"}
        gap={"12px"}
      >
        <DialogHeader>
          <DialogTitle
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <Text fontSize={"18px"} fontWeight={"600"}>
              Select token
            </Text>
            <Button
              bgColor={"transparent"}
              boxSizing={"content-box"}
              justifyContent={"flex-end"}
              width={"24px"}
              height={"24px"}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <CloseIconComponent />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Flex flexDir={"column"} gap={"16px"}>
            {tokenList.map((token) => (
              <TokenInfoComponent
                key={`${token.address}-${token.symbol}`}
                token={token}
                onClick={handleTokenSelected}
              />
            ))}
          </Flex>
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
};
