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
import { Text, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { jotaiInvalidRPCWarningModalOpen } from "@/jotai/bridge";
import { CloseIconComponent } from "../icons/Close";
import { INVALID_RPC_GUIDE_URL } from "@/constants/urls";
import Link from "next/link";
import { l2Chain } from "@/config/network";

const l2RpcUrl = l2Chain.rpcUrls.default.http[0];

const isLocalhostUrl = (url: string) => {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "host.docker.internal"
    );
  } catch {
    return false;
  }
};

export const InvalidRPCWarningModalComponent = () => {
  const [isOpen, setIsOpen] = useAtom(jotaiInvalidRPCWarningModalOpen);
  const isLocalNetwork = isLocalhostUrl(l2RpcUrl);

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
        w={"420px"}
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
              Warning
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
          {isLocalNetwork ? (
            <VStack align="start" gap="12px">
              <Text fontSize={"14px"} fontWeight={"400"} color={"#E5E5E5"}>
                MetaMask cannot automatically add local networks. Please add
                the network manually via{" "}
                <Text as="span" fontWeight={"600"}>
                  Settings → Networks → Add a network
                </Text>
                .
              </Text>
              <VStack
                align="start"
                width="100%"
                padding="12px"
                bgColor="#1a1d24"
                borderRadius="8px"
                gap="6px"
              >
                <Text fontSize={"13px"} color={"#888888"}>
                  Network name:{" "}
                  <Text as="span" color={"#E5E5E5"}>
                    {l2Chain.name}
                  </Text>
                </Text>
                <Text fontSize={"13px"} color={"#888888"} fontFamily="mono">
                  RPC URL:{" "}
                  <Text as="span" color={"#E5E5E5"}>
                    {l2RpcUrl}
                  </Text>
                </Text>
                <Text fontSize={"13px"} color={"#888888"}>
                  Chain ID:{" "}
                  <Text as="span" color={"#E5E5E5"}>
                    {l2Chain.id}
                  </Text>
                </Text>
                <Text fontSize={"13px"} color={"#888888"}>
                  Currency symbol:{" "}
                  <Text as="span" color={"#E5E5E5"}>
                    {l2Chain.nativeCurrency.symbol}
                  </Text>
                </Text>
              </VStack>
            </VStack>
          ) : (
            <Text fontSize={"14px"} fontWeight={"400"} color={"#E5E5E5"}>
              You can&apos;t automatically switch the chain in this app. Please
              try to add the network in your wallet manually. Read about it
              more{" "}
              <u>
                <Link href={INVALID_RPC_GUIDE_URL} target="_blank">
                  here
                </Link>
              </u>
              .
            </Text>
          )}
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
};
