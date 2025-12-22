import { Chain } from "wagmi/chains";
import { useCallback, useEffect, useRef, useState } from "react";

const toHex = (chainId: number) => `0x${chainId.toString(16)}`;

const formatSymbol = (symbol: string) => symbol.slice(0, 6);

const validateChain = (chain: Chain): string | null => {
  if (!chain.name?.trim()) {
    return "Invalid chain: missing name";
  }
  if (!chain.rpcUrls?.default?.http?.[0]?.trim()) {
    return "Invalid chain: missing RPC URL";
  }
  if (!chain.nativeCurrency?.symbol?.trim()) {
    return "Invalid chain: missing currency symbol";
  }
  return null;
};

const getErrorMessage = (code: number | undefined): string | null => {
  switch (code) {
    case 4001:
      return "Request rejected";
    case -32002:
      return "Request pending. Check your wallet and complete the pending request.";
    case -32603:
      return "Network error. Please try again.";
    default:
      return null;
  }
};

const getCurrentChainId = async (): Promise<string | null> => {
  try {
    const chainId = await window.ethereum?.request({ method: "eth_chainId" });
    return chainId as string | null;
  } catch {
    return null;
  }
};

export const useAddToWallet = () => {
  const [isAdding, setIsAdding] = useState(false);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const addNetworkToWallet = useCallback(async (chain: Chain) => {
    if (!window.ethereum) {
      return { success: false, error: "No wallet detected" };
    }

    const validationError = validateChain(chain);
    if (validationError) {
      return { success: false, error: validationError };
    }

    setIsAdding(true);

    const chainIdHex = toHex(chain.id);

    try {
      // Get current chain before attempting switch
      const initialChainId = await getCurrentChainId();

      // Check if already on the target chain
      if (initialChainId === chainIdHex) {
        return { success: true, message: `Already connected to ${chain.name}` };
      }

      // First try to switch - this works if chain already exists
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });

      // Verify the switch actually happened
      const newChainId = await getCurrentChainId();
      if (newChainId === chainIdHex) {
        return { success: true, message: `Switched to ${chain.name}` };
      } else {
        return { success: false, error: "Network switch was not completed" };
      }
    } catch (switchError) {
      const sErr = switchError as { code?: number; message?: string };

      // Check for known error codes
      const knownError = getErrorMessage(sErr.code);
      if (knownError && sErr.code !== 4902) {
        return { success: false, error: knownError };
      }

      // Chain not added (4902) - need to add it
      if (sErr.code === 4902) {
        try {
          const blockExplorerUrl = chain.blockExplorers?.default?.url;
          const hasValidExplorer = blockExplorerUrl && blockExplorerUrl.trim() !== "";

          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: chain.name,
                nativeCurrency: {
                  name: chain.nativeCurrency.name,
                  symbol: formatSymbol(chain.nativeCurrency.symbol),
                  decimals: chain.nativeCurrency.decimals,
                },
                rpcUrls: [chain.rpcUrls.default.http[0]],
                blockExplorerUrls: hasValidExplorer ? [blockExplorerUrl] : undefined,
              },
            ],
          });

          // Verify the network was added and switched
          const finalChainId = await getCurrentChainId();
          if (finalChainId === chainIdHex) {
            return { success: true, message: `${chain.name} added to wallet` };
          } else {
            return { success: false, error: "Network was added but switch was not completed" };
          }
        } catch (addError) {
          const aErr = addError as { code?: number; message?: string };
          const addKnownError = getErrorMessage(aErr.code);
          if (addKnownError) {
            return { success: false, error: addKnownError };
          }
          return { success: false, error: aErr.message || "Failed to add network" };
        }
      }

      // Other switch errors
      return { success: false, error: sErr.message || "Failed to switch network" };
    } finally {
      if (isMountedRef.current) {
        setIsAdding(false);
      }
    }
  }, []);

  return { addNetworkToWallet, isAdding };
};
