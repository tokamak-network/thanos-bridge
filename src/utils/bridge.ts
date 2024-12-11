import {
  BridgeModeEnum,
  BridgeTokenEnum,
  BridgeTransactionInfo,
} from "@/types/bridge";
import { Token } from "@/types/token";

export const getBridgeTokenType = (token: Token): BridgeTokenEnum => {
  switch (token.bridgedTokenSymbol) {
    case "eth":
      return BridgeTokenEnum.ETH;
    case "native":
      return BridgeTokenEnum.NATIVE_TOKEN;
    case "usdc":
      return BridgeTokenEnum.USDC;
    default:
      return BridgeTokenEnum.ERC_20;
  }
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
