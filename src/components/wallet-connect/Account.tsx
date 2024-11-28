"use client";

import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { Button } from "../ui/button";
import { useEnsName } from "wagmi";
import { useAtom } from "jotai";
import { walletConnectModalOpenedStatus } from "@/jotai/wallet-connect";

export const Account = () => {
  const { address, isConnected, disconnect, connect, connectors } =
    useWalletConnect();
  const { data: ensName } = useEnsName({ address });
  const [isOpen, setIsOpen] = useAtom(walletConnectModalOpenedStatus);

  const handleWalletConnect = () => {
    if (isConnected) disconnect();
    setIsOpen(true);
  };
  return (
    <Button
      px={"12px"}
      py={"8px"}
      bgColor={"#101217"}
      borderRadius={"8px"}
      border={"1px solid #555A64"}
      fontWeight={500}
      fontSize={"16px"}
      _hover={{ bgColor: "#25282F" }}
      onClick={handleWalletConnect}
    >
      {isConnected ? ensName : "Connect Wallet"}
    </Button>
  );
};
