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
import { jotaiGeneralWarningModal } from "@/jotai/bridge";
import { CloseIconComponent } from "../icons/Close";

export const GeneralWarningModalComponent: React.FC = () => {
  const [generalWarningModal, setGeneralWarningModal] = useAtom(
    jotaiGeneralWarningModal
  );
  const handleModalClose = () => {
    setGeneralWarningModal((prev) => ({ ...prev, isOpen: false }));
  };
  return (
    <DialogRoot
      open={generalWarningModal.isOpen}
      placement={"center"}
      onEscapeKeyDown={() => handleModalClose()}
      onInteractOutside={() => handleModalClose()}
      onExitComplete={() => handleModalClose()}
      onFocusOutside={() => handleModalClose()}
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
              {generalWarningModal.title}
            </Text>
            <Button
              bgColor={"transparent"}
              boxSizing={"content-box"}
              justifyContent={"flex-end"}
              width={"24px"}
              height={"24px"}
              onClick={() => {
                handleModalClose();
              }}
            >
              <CloseIconComponent />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text fontSize={"14px"} fontWeight={"400"} color={"#E5E5E5"}>
            {generalWarningModal.description}
          </Text>
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
};
