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
      AddressManager: "0xca074de2a95EE6ea37003585E8679f8f215Ea04c" as const,
      L1CrossDomainMessenger:
        "0xd054Bc768aAC07Dd0BaA2856a2fFb68F495E4CC2" as const,
      L1StandardBridge: "0x757EC5b8F81eDdfC31F305F3325Ac6Abf4A63a5D" as const,
      StateCommitmentChain:
        "0x0000000000000000000000000000000000000000" as const,
      CanonicalTransactionChain:
        "0x0000000000000000000000000000000000000000" as const,
      BondManager: "0x0000000000000000000000000000000000000000" as const,
      OptimismPortal: "0x2fbD30Fcd1c4573b0288E706Be56B5c0d2DfcAF6" as const,
      OptimismPortal2: "0x2fbD30Fcd1c4573b0288E706Be56B5c0d2DfcAF6" as const,
      L2OutputOracle: "0xC0885eEc313e31a917DFd5d6Bf33565826B93A3F" as const,
      L1UsdcBridge: "0x7dD2196722FBe83197820BF30e1c152e4FBa0a6A" as const,
      DisputeGameFactory: "0x524c885A976c13497900A04257605cd231Ab0026" as const,
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
