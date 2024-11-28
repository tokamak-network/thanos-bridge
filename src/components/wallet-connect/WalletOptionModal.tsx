import { useModal } from "@/contexts/modalContext";
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

export const WalletOptionModal: React.FC = () => {
  const { isWalletModalOpen, closeWalletModal } = useModal();
  return (
    <Modal isOpen={isWalletModalOpen} onClose={closeWalletModal} isCentered>
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
          <Button colorScheme="blue" mr={3} onClick={closeWalletModal}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
