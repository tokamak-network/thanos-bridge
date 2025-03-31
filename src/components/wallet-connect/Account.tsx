"use client";

import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { walletConnectModalOpenedStatus } from "@/jotai/wallet-connect";
import { trimAddress } from "@/utils/address";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { DisconnectIconComponent } from "@/components/icons/Disconnect";

export const Account = () => {
  const { address, isConnected, disconnect } = useWalletConnect();
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
    <MenuRoot>
      {isConnected ? (
        <MenuTrigger asChild>
          <Button
            px={"12px"}
            py={"8px"}
            height={"46px"}
            bgColor={"#101217"}
            borderRadius={"8px"}
            border={"1px solid #25282F"}
            fontWeight={500}
            fontSize={"16px"}
            lineHeight={"24px"}
            _hover={{ border: "1px solid #555A64" }}
          >
            {buttonText}
          </Button>
        </MenuTrigger>
      ) : (
        <Button
          px={"12px"}
          py={"8px"}
          height={"46px"}
          bgColor={"#101217"}
          borderRadius={"8px"}
          border={"1px solid #25282F"}
          fontWeight={500}
          fontSize={"16px"}
          lineHeight={"24px"}
          _hover={{ border: "1px solid #555A64" }}
          onClick={handleWalletConnect}
        >
          {buttonText}
        </Button>
      )}
      <MenuContent
        display={"flex"}
        flexDir={"column"}
        py={"8px"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        gap={"12px"}
        width={"192px"}
        borderRadius={"6px"}
        bgColor={"#101217"}
        border={"1px solid #25282F"}
      >
        <MenuItem
          value="Disconnect"
          width={"192px"}
          height={"40px"}
          px={"12px"}
          py={"6px"}
          bgColor={"transparent"}
          _hover={{ bgColor: "#1D1F25" }}
          fontSize={"14px"}
          fontWeight={500}
          justifyContent={"flex-start"}
          color={"#FFFFFF"}
          cursor={"pointer"}
          gap={"8px"}
          onClick={() => {
            disconnect();
          }}
        >
          <DisconnectIconComponent width={20} height={20} />
          Disconnect
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
