import { useAddToWallet } from "@/hooks/wallet/useAddToWallet";
import { Button } from "@/components/ui/button";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { Chain } from "wagmi/chains";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { FiCheck, FiPlus } from "react-icons/fi";

interface AddToWalletButtonProps {
  chain: Chain;
}

const toHex = (chainId: number) => `0x${chainId.toString(16)}`;

export const AddToWalletButton: React.FC<AddToWalletButtonProps> = ({
  chain,
}) => {
  const { addNetworkToWallet, isAdding } = useAddToWallet();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Check if already on this network
  useEffect(() => {
    const checkCurrentNetwork = async () => {
      if (!window.ethereum) return;
      try {
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
        if (isMountedRef.current) {
          setIsOnNetwork(currentChainId === toHex(chain.id));
        }
      } catch {
        if (isMountedRef.current) {
          setIsOnNetwork(false);
        }
      }
    };

    checkCurrentNetwork();
  }, [chain.id]);

  // Listen for chain changes
  useEffect(() => {
    const ethereum = window.ethereum;
    if (!ethereum?.on) return;

    const handleChainChanged = (chainId: string) => {
      if (!isMountedRef.current) return;

      const isTargetChain = chainId === toHex(chain.id);
      setIsOnNetwork(isTargetChain);

      // If we switched to this chain and were in adding state, show success
      if (isTargetChain && isAdding) {
        setIsSuccess(true);
        toast.success(`Connected to ${chain.name}`);

        // Clear existing timeout before setting new one
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setIsSuccess(false);
          }
        }, 3000);
      }
    };

    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [chain.id, chain.name, isAdding]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset on chain prop change
  useEffect(() => {
    setIsSuccess(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [chain.id]);

  const handleClick = useCallback(async () => {
    // Clear any previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsSuccess(false);

    const result = await addNetworkToWallet(chain);

    if (!isMountedRef.current) return;

    if (result.success) {
      setIsSuccess(true);
      setIsOnNetwork(true);
      toast.success(result.message);
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setIsSuccess(false);
        }
      }, 3000);
    } else {
      setIsSuccess(false);
      toast.error(result.error);
    }
  }, [chain, addNetworkToWallet]);

  // Determine button text and state
  const getButtonContent = () => {
    if (isAdding) {
      return (
        <>
          <Spinner size={"sm"} color={"white"} />
          <Text>Processing...</Text>
        </>
      );
    }

    if (isSuccess) {
      return (
        <>
          <FiCheck size={18} />
          <Text>Done</Text>
        </>
      );
    }

    if (isOnNetwork) {
      return (
        <>
          <FiCheck size={16} />
          <Text>Connected to {chain.name}</Text>
        </>
      );
    }

    return (
      <>
        <FiPlus size={16} />
        <Text>Add {chain.name} to Wallet</Text>
      </>
    );
  };

  const getAriaLabel = () => {
    if (isAdding) return `Adding ${chain.name} to wallet`;
    if (isSuccess) return `Successfully added ${chain.name}`;
    if (isOnNetwork) return `Already connected to ${chain.name}`;
    return `Add ${chain.name} to wallet`;
  };

  return (
    <Button
      w={"100%"}
      h={"48px"}
      bg={isSuccess || isOnNetwork ? "#1a472a" : "#0070ED"}
      color={"#FFFFFF"}
      borderRadius={"8px"}
      fontSize={"14px"}
      fontWeight={600}
      border={"none"}
      _hover={{ bg: isSuccess || isOnNetwork ? "#1a472a" : "#0058c4" }}
      disabled={isAdding || isOnNetwork}
      onClick={handleClick}
      aria-label={getAriaLabel()}
      aria-busy={isAdding}
    >
      <Flex alignItems={"center"} gap={"8px"}>
        {getButtonContent()}
      </Flex>
    </Button>
  );
};
