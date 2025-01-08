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
import { Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { jotaiInvalidRPCWarningModalOpen } from "@/jotai/bridge";
import { CloseIconComponent } from "../icons/Close";

export const InvalidRPCWarningModalComponent = () => {
  const [isOpen, setIsOpen] = useAtom(jotaiInvalidRPCWarningModalOpen);
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
          <Text fontSize={"14px"} fontWeight={"400"} color={"#E5E5E5"}>
            You can&apos;t switch the chain in this app since the RPC URL is not
            secure. Please try to switch network via your wallet.{" "}
            <u>Read about it more here.</u>
          </Text>
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
};
