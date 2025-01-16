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

export const downloadTxHash = (
  l1ChainName: string,
  l1ChainId: number,
  l2ChainName: string,
  l2ChainId: number,
  tokenName: string,
  amount: string,
  txHash: string
) => {
  const blob = new Blob(
    [
      `Withdraw Transaction Information\nDate: ${new Date().toISOString()}\nL1 Chain: ${l1ChainName} (Chain ID: ${l1ChainId})\nL2 Chain: ${l2ChainName} (Chain ID: ${l2ChainId})\nToken Name: ${tokenName}\nAmount: ${amount}\nTransaction Hash: ${txHash}`,
    ],
    {
      type: "text/plain",
    }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = txHash;
  a.click();
};
