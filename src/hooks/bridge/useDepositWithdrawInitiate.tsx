import { useEffect } from "react";
import { useWalletConnect } from "../wallet-connect/useWalletConnect";
import { useAtom } from "jotai";
import { jotaiBridgeTransactionInfo } from "@/jotai/bridge";
import {
  BridgeModeEnum,
  BridgeTransactionInfo,
  BridgingStepEnum,
} from "@/types/bridge";
import { l1Chain, l2Chain } from "@/config/network";
import { getTokenInfoByChainId } from "@/utils/token";
import { supportedTokens } from "@/constants/token";
import { getBridgeTokenType } from "@/utils/bridge";
import { ChainLayerEnum } from "@/types/network";
import { getChainLayer } from "@/utils/network";

export const useDepositWithdrawInitiate = () => {
  const { isConnected, address, chain } = useWalletConnect();
  const [transaction, setTransaction] = useAtom(jotaiBridgeTransactionInfo);
  useEffect(() => {
    if (transaction.mode === BridgeModeEnum.DEPOSIT) {
      setTransaction((prev) => ({
        ...prev,
        amount: BigInt(0),
        formatted: "",
        fromChain: l1Chain,
        toChain: l2Chain,
      }));
    } else {
      setTransaction((prev) => ({
        ...prev,
        amount: BigInt(0),
        formatted: "",
        fromChain: l2Chain,
        toChain: l1Chain,
      }));
    }
    const chainId =
      transaction.mode === BridgeModeEnum.DEPOSIT ? l1Chain.id : l2Chain.id;
    const supportedTokenList = getTokenInfoByChainId(chainId);
    if (supportedTokenList.length === 0) return;
    const token1 = supportedTokenList[0];
    const token2 = supportedTokens.find(
      (t) =>
        t.chainId !== token1.chainId &&
        t.bridgedTokenSymbol === token1.bridgedTokenSymbol
    );
    setTransaction((prev) => ({
      ...prev,
      l1Token: transaction.mode === BridgeModeEnum.DEPOSIT ? token1 : token2,
      l2Token: transaction.mode === BridgeModeEnum.DEPOSIT ? token2 : token1,
    }));
  }, [transaction.mode, setTransaction]);

  useEffect(() => {
    if (!isConnected) return;
    setTransaction((prev) => ({
      ...prev,
      fromAddress: address as `0x${string}`,
      toAddress: "",
    }));
  }, [isConnected, address, setTransaction]);

  useEffect(() => {
    if (!transaction.l1Token || !transaction.l2Token) return;
    const bridgeTokenType = getBridgeTokenType(transaction.l1Token);
    setTransaction((prev) => ({ ...prev, bridgeTokenType }));
  }, [transaction.l1Token, transaction.l2Token, setTransaction]);

  useEffect(() => {
    if (!chain) return;
    const chainLayer = getChainLayer(chain.id);
    if (
      chainLayer === ChainLayerEnum.L1 &&
      (transaction.step === BridgingStepEnum.PROVE ||
        transaction.step === BridgingStepEnum.FINALIZE)
    )
      return;
    setTransaction((prev: BridgeTransactionInfo) => ({
      ...prev,
      mode:
        chainLayer === ChainLayerEnum.L1
          ? BridgeModeEnum.DEPOSIT
          : BridgeModeEnum.WITHDRAW,
      step: BridgingStepEnum.INITIATE,
    }));
  }, [chain, transaction.mode, setTransaction]);
  return { transaction };
};
