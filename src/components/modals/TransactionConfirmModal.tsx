"use client";
import React, { useMemo } from "react";
import {
  DialogBody,
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Box, DialogBackdrop, Text } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { CloseIconComponent } from "../icons/Close";
import { Button } from "../ui/button";
import { jotaiTransactionConfirmModalStatus } from "@/jotai/bridge";
import { TransactionStatusEnum } from "@/types/transaction";
export const TransactionConfirmModalComponent: React.FC = () => {
  const [transactionConfirmModalStatus, setTransactionConfirmModalStatus] =
    useAtom(jotaiTransactionConfirmModalStatus);
  const modalTitle = useMemo(() => {
    switch (transactionConfirmModalStatus.status) {
      case TransactionStatusEnum.CONFIRMING:
        return "Confirming";
      case TransactionStatusEnum.SUCCESS:
        return "Transaction Confirmed!";
      case TransactionStatusEnum.ERROR:
        return "Transaction Failed!";
    }
  }, [transactionConfirmModalStatus.status]);
  const modalContent = useMemo(() => {
    switch (transactionConfirmModalStatus.status) {
      case TransactionStatusEnum.CONFIRMING:
        return "Please confirm txn. If it's not updating, check your wallet.";
      case TransactionStatusEnum.SUCCESS:
        return "See your transaction history";
      case TransactionStatusEnum.ERROR:
        return "Error occurred, please try again.";
    }
  }, [transactionConfirmModalStatus.status]);
  const handleModalClose = () => {
    setTransactionConfirmModalStatus({
      ...transactionConfirmModalStatus,
      isOpen: false,
    });
  };
  return (
    <DialogRoot
      open={transactionConfirmModalStatus.isOpen}
      placement={"center"}
    >
      <DialogBackdrop />
      <DialogTrigger />
      <DialogContent
        bgColor={"#101217"}
        width={"254px"}
        height={"332px"}
        borderRadius={"16px"}
        border={"1px solid #25282F"}
      >
        <DialogBody position={"relative"}>
          <Box position={"absolute"} right={"14px"} top={"14px"}>
            <Button
              size={"2xs"}
              padding={"0"}
              bgColor={"transparent"}
              onClick={handleModalClose}
            >
              <CloseIconComponent width={24} height={24} />
            </Button>
          </Box>
          <Text
            mt={"50px"}
            fontSize={"18px"}
            fontWeight={"500"}
            lineHeight={"26px"}
            textAlign={"center"}
          >
            {modalTitle}
          </Text>
          <Text
            fontSize={"14px"}
            fontWeight={"500"}
            lineHeight={"26px"}
            textAlign={"center"}
            mt={"175px"}
            justifyContent={"center"}
            textDecoration={
              transactionConfirmModalStatus.status ===
              TransactionStatusEnum.SUCCESS
                ? "underline"
                : "none"
            }
            onClick={() => {
              if (
                transactionConfirmModalStatus.status ===
                TransactionStatusEnum.SUCCESS
              ) {
                window.open(transactionConfirmModalStatus.txHash, "_blank");
              }
            }}
          >
            {modalContent}
          </Text>
          <Box
            position={"absolute"}
            top={"50%"}
            left={"50%"}
            transform={"translate(-50%, -50%)"}
          >
            <Spinner
              color={"#007AFF"}
              width={"96px"}
              height={"96px"}
              borderWidth={"10px"}
              animationDuration={"1s"}
              margin={"0 auto"}
              css={{ "--spinner-track-color": "#25282F" }}
            />
          </Box>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
