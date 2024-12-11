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
import { TransactionConfirmedIconComponent } from "../icons/TransactionConfirmed";
import { TransactionFailedIconComponent } from "../icons/TransactionFailed";
import Link from "next/link";
import { l1Chain, l2Chain } from "@/config/network";
import { BridgeModeEnum } from "@/types/bridge";
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
    setTransactionConfirmModalStatus((prev) => ({ ...prev, isOpen: false }));
  };
  const blockExplorerURL = useMemo(() => {
    return transactionConfirmModalStatus.mode === BridgeModeEnum.DEPOSIT
      ? l1Chain.blockExplorers?.default.url
      : l2Chain.blockExplorers?.default.url;
  }, [transactionConfirmModalStatus.mode]);
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
            mt={"55px"}
            fontSize={"18px"}
            fontWeight={"500"}
            lineHeight={"26px"}
            textAlign={"center"}
          >
            {modalTitle}
          </Text>

          {transactionConfirmModalStatus.status ===
          TransactionStatusEnum.SUCCESS ? (
            <Link
              href={`${blockExplorerURL}/tx/${transactionConfirmModalStatus.txHash}`}
              target="_blank"
            >
              <Text
                fontSize={"14px"}
                fontWeight={"500"}
                lineHeight={"26px"}
                textAlign={"center"}
                mt={"175px"}
                justifyContent={"center"}
                textDecoration={"underline"}
              >
                See your transaction history
              </Text>
            </Link>
          ) : (
            <Text
              fontSize={"14px"}
              fontWeight={"500"}
              lineHeight={"26px"}
              textAlign={"center"}
              mt={"175px"}
              justifyContent={"center"}
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
          )}
          <Box
            position={"absolute"}
            top={"50%"}
            left={"50%"}
            transform={"translate(-50%, -50%)"}
          >
            {transactionConfirmModalStatus.status ===
              TransactionStatusEnum.CONFIRMING && (
              <Spinner
                color={"#007AFF"}
                width={"96px"}
                height={"96px"}
                borderWidth={"10px"}
                animationDuration={"1s"}
                margin={"0 auto"}
                css={{ "--spinner-track-color": "#25282F" }}
              />
            )}
            {transactionConfirmModalStatus.status ===
              TransactionStatusEnum.SUCCESS && (
              <TransactionConfirmedIconComponent width={96} height={96} />
            )}
            {transactionConfirmModalStatus.status ===
              TransactionStatusEnum.ERROR && (
              <TransactionFailedIconComponent width={96} height={96} />
            )}
          </Box>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
