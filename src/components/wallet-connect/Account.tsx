"use client";

import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { walletConnectModalOpenedStatus } from "@/jotai/wallet-connect";
import { trimAddress } from "@/utils/trimAddress";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export const Account = () => {
  const { address, isConnected } = useWalletConnect();
  const [, setIsOpen] = useAtom(walletConnectModalOpenedStatus);
  const [buttonText, setButtonText] = useState("Connect Wallet");

  const handleWalletConnect = () => {
    if (!isConnected) setIsOpen(true);
  };

  useEffect(() => {
    if (!isConnected) {
      setButtonText("Connect Wallet");
    } else {
      setButtonText(trimAddress({ address, firstChar: 6, lastChar: 4 }));
    }
  }, [address, isConnected]);

  return (
    <Button
      px={"12px"}
      py={"8px"}
      bgColor={"#101217"}
      borderRadius={"8px"}
      border={"1px solid #25282F"}
      fontWeight={500}
      fontSize={"16px"}
      lineHeight={"normal"}
      _hover={{ bgColor: "#25282F" }}
      onClick={handleWalletConnect}
    >
      {buttonText}
    </Button>
  );
};
