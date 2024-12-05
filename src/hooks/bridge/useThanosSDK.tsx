const thanosSDK = require("@tokamak-network/thanos-sdk");
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useWalletConnect } from "../wallet-connect/useWalletConnect";
import { CrossChainMessenger } from "@tokamak-network/thanos-sdk";

export const useThanosSDK = (l1ChainId: number, l2ChainId: number) => {
  const { isConnected, chain } = useWalletConnect();
  const [crossChainMessenger, setCrossChainMessenger] =
    useState<CrossChainMessenger | null>(null);
  useEffect(() => {
    if (!l1ChainId || !l2ChainId) return;
    if (!isConnected) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const l1Contracts = {
      AddressManager: process.env.NEXT_PUBLIC_ADDRESS_MANAGER_ADDRESS,
      L1CrossDomainMessenger:
        process.env.NEXT_PUBLIC_L1_CROSS_DOMAIN_MESSENGER_ADDRESS,
      L1StandardBridge: process.env.NEXT_PUBLIC_STANDARD_BRIDGE_ADDRESS,
      StateCommitmentChain:
        "0x0000000000000000000000000000000000000000" as const,
      CanonicalTransactionChain:
        "0x0000000000000000000000000000000000000000" as const,
      BondManager: "0x0000000000000000000000000000000000000000" as const,
      OptimismPortal: process.env.NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS,
      OptimismPortal2: process.env.NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS,
      L2OutputOracle: process.env.NEXT_PUBLIC_L2_OUTPUT_ORACLE_ADDRESS,
      L1UsdcBridge: process.env.NEXT_PUBLIC_L1_USDC_BRIDGE_ADDRESS,
      DisputeGameFactory: process.env.NEXT_PUBLIC_DISPUTE_GAME_FACTORY_ADDRESS,
    };
    const cm = new thanosSDK.CrossChainMessenger({
      bedrock: true,
      contracts: {
        l1: l1Contracts,
      },
      l1ChainId: l1ChainId,
      l2ChainId: l2ChainId,
      l1SignerOrProvider: provider.getSigner(),
      l2SignerOrProvider: provider.getSigner(),
      nativeTokenAddress: process.env.NEXT_PUBLIC_NATIVE_TOKEN_L1_ADDRESS,
    });
    setCrossChainMessenger(cm);
  }, [l1ChainId, l2ChainId, chain, isConnected]);

  const estimateGas = useMemo(() => {
    if (!crossChainMessenger) return null;
    return crossChainMessenger.estimateGas;
  }, [crossChainMessenger]);

  return { crossChainMessenger, estimateGas };
};
