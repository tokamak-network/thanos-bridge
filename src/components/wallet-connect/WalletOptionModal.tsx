"use client";

import React, { useEffect } from "react";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";

import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { walletConnectModalOpenedStatus } from "@/jotai/wallet-connect";
import { Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { WalletOption } from "./WalletOption";

export const WalletOptionModal: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(walletConnectModalOpenedStatus);
  const { connectors, connect, isConnected } = useWalletConnect();

  useEffect(() => {
    if (isConnected) {
      setIsOpen(false);
    }
  }, [isConnected, setIsOpen]);

  return (
    <DialogRoot
      open={isOpen}
      placement="center"
      onEscapeKeyDown={() => setIsOpen(false)}
      onInteractOutside={() => setIsOpen(false)}
      onExitComplete={() => setIsOpen(false)}
      onFocusOutside={() => setIsOpen(false)}
    >
      <DialogContent
        bg={"#101217"}
        p={"24px"}
        borderRadius={"22px"}
        w={"390px"}
      >
        <DialogHeader>
          <DialogTitle fontSize={"18px"} fontWeight={"600"} lineHeight={"27px"}>
            Connect Wallet
          </DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger
          onClick={() => setIsOpen(false)}
          color={"white"}
          bgColor={"transparent"}
        />
        <DialogBody mt={"12px"}>
          <Flex flexDirection={"column"} gap={"16px"}>
            {connectors
              .filter((connector) => connector.name === "MetaMask")
              .map((connector) => (
                <WalletOption
                  key={connector.id}
                  connector={connector}
                  onClick={() => connect({ connector })}
                />
              ))}
          </Flex>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
