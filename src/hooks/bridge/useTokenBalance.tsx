import { useState } from "react";

import { getBridgeToken } from "@/utils/bridge";
import { getTokenBalanceByChainId } from "@/utils/token-balance";
import { useEffect } from "react";
import { TokenBalance } from "@/types/token";
import { BridgeTransactionInfo } from "@/types/bridge";
import { useWalletConnect } from "../wallet-connect/useWalletConnect";

export const useTokenBalance = (transaction: BridgeTransactionInfo) => {
  const [balance, setBalance] = useState<TokenBalance | null>(null);
  const { isConnected } = useWalletConnect();
  useEffect(() => {
    if (!isConnected) return;
    const bridgeToken = getBridgeToken(transaction);
    if (!bridgeToken) return;
    getTokenBalanceByChainId(
      transaction.fromAddress as `0x${string}`,
      bridgeToken.chainId,
      bridgeToken.address
    ).then((balance) => {
      setBalance(balance);
    });
  }, [transaction, setBalance, isConnected]);
  return { balance };
};
