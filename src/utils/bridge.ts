import {
  BridgeModeEnum,
  BridgeTokenEnum,
  BridgeTransactionInfo,
} from "@/types/bridge";
import { Token } from "@/types/token";

export const getBridgeTokenType = (
  l1Token: Token,
  l2Token: Token
): BridgeTokenEnum => {
  if (!l1Token.address) return BridgeTokenEnum.ETH;
  if (!l2Token.address) return BridgeTokenEnum.NATIVE_TOKEN;
  return BridgeTokenEnum.ERC_20;
};

export const getBridgeToken = (transaction: BridgeTransactionInfo) => {
  return transaction.mode === BridgeModeEnum.DEPOSIT
    ? transaction.l1Token
    : transaction.l2Token;
};

export const isValidTxHash = (txHash: string): boolean => {
  const pattern = /^0x[a-fA-F0-9]{64}$/;
  return pattern.test(txHash);
};
