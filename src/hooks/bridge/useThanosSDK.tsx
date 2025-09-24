const thanosSDK = require("@tokamak-network/thanos-sdk");
import { useEffect, useMemo, useState } from "react";
import { useWalletConnect } from "../wallet-connect/useWalletConnect";
import { CrossChainMessenger } from "@tokamak-network/thanos-sdk";
import { getChainLayer } from "@/utils/network";
import { ChainLayerEnum } from "@/types/network";
import { l1Provider, l2Provider } from "@/constants/provider";
import { env } from "next-runtime-env";
import { getEthersSigner } from "@/utils/provider";
import { config } from "@/config/wagmi.config";
import { useChainId } from "wagmi";

export const useThanosSDK = (l1ChainId: number, l2ChainId: number) => {
  const { isConnected, chain } = useWalletConnect();
  const chainId = useChainId();
  const [crossChainMessenger, setCrossChainMessenger] =
    useState<CrossChainMessenger | null>(null);
  const chainLayer = useMemo(
    () => (chain ? getChainLayer(chain.id) : null),
    [chain]
  );
  useEffect(() => {
    const init = async () => {
      try {
        if (!l1ChainId || !l2ChainId) return;
        if (!isConnected) return;
        await new Promise((resolve) => setTimeout(resolve, 500));
        const signer = await getEthersSigner(config, { chainId });
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
            chainLayer === ChainLayerEnum.L1 ? signer : l1Provider,
          l2SignerOrProvider:
            chainLayer === ChainLayerEnum.L2 ? signer : l2Provider,
          nativeTokenAddress: env("NEXT_PUBLIC_NATIVE_TOKEN_L1_ADDRESS"),
        });
        setCrossChainMessenger(cm);
      } catch (error) {
        console.error("Error initializing Thanos SDK:", error);
      }
    };
    init();
  }, [isConnected, chainId]);

  const estimateGas = useMemo(() => {
    if (!crossChainMessenger) return null;
    return crossChainMessenger.estimateGas;
  }, [crossChainMessenger]);

  return { crossChainMessenger, estimateGas };
};
