const thanosSDK = require("@tokamak-network/thanos-sdk");
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useWalletConnect } from "../wallet-connect/useWalletConnect";
import { CrossChainMessenger } from "@tokamak-network/thanos-sdk";
import { getChainLayer } from "@/utils/network";
import { ChainLayerEnum } from "@/types/network";
import { l1Provider, l2Provider } from "@/constants/provider";
import { env } from "next-runtime-env";

export const useThanosSDK = (l1ChainId: number, l2ChainId: number) => {
  const { isConnected, chain } = useWalletConnect();
  const [crossChainMessenger, setCrossChainMessenger] =
    useState<CrossChainMessenger | null>(null);
  const chainLayer = useMemo(
    () => (chain ? getChainLayer(chain.id) : null),
    [chain]
  );
  useEffect(() => {
    if (!l1ChainId || !l2ChainId) return;
    if (!isConnected) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const l1Contracts = {
      AddressManager: env("NEXT_PUBLIC_ADDRESS_MANAGER_ADDRESS"),
      L1CrossDomainMessenger: env(
        "NEXT_PUBLIC_L1_CROSS_DOMAIN_MESSENGER_ADDRESS"
      ),
      L1StandardBridge: env("NEXT_PUBLIC_STANDARD_BRIDGE_ADDRESS"),
      StateCommitmentChain:
        "0x0000000000000000000000000000000000000000" as const,
      CanonicalTransactionChain:
        "0x0000000000000000000000000000000000000000" as const,
      BondManager: "0x0000000000000000000000000000000000000000" as const,
      OptimismPortal: env("NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS"),
      OptimismPortal2: env("NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS"),
      L2OutputOracle: env("NEXT_PUBLIC_L2_OUTPUT_ORACLE_ADDRESS"),
      L1UsdcBridge: env("NEXT_PUBLIC_L1_USDC_BRIDGE_ADDRESS"),
      DisputeGameFactory: env("NEXT_PUBLIC_DISPUTE_GAME_FACTORY_ADDRESS"),
    };
    const cm = new thanosSDK.CrossChainMessenger({
      bedrock: true,
      contracts: {
        l1: l1Contracts,
      },
      l1ChainId: l1ChainId,
      l2ChainId: l2ChainId,
      l1SignerOrProvider:
        chainLayer === ChainLayerEnum.L1 ? provider.getSigner() : l1Provider,
      l2SignerOrProvider:
        chainLayer === ChainLayerEnum.L2 ? provider.getSigner() : l2Provider,
      nativeTokenAddress: env("NEXT_PUBLIC_NATIVE_TOKEN_L1_ADDRESS"),
    });
    setCrossChainMessenger(cm);
  }, [l1ChainId, l2ChainId, chain, isConnected, chainLayer]);

  const estimateGas = useMemo(() => {
    if (!crossChainMessenger) return null;
    return crossChainMessenger.estimateGas;
  }, [crossChainMessenger]);

  return { crossChainMessenger, estimateGas };
};
