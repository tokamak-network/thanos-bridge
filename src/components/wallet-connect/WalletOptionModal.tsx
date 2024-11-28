"use client";

import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { Text } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useAtom } from "jotai";
import { walletConnectModalOpenedStatus } from "@/jotai/wallet-connect";

export const WalletOptionModal: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(walletConnectModalOpenedStatus);
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb="1rem">
            You can scroll the content behind the modal
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
