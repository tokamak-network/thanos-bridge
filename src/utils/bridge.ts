import {
  BridgeModeEnum,
  BridgeTokenEnum,
  BridgeTransactionInfo,
} from "@/types/bridge";
import { Token } from "@/types/token";
import { env } from "next-runtime-env";

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

export const getDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getRemainingSeconds = (date: string) => {
  const dateObj = new Date(date);
  const now = new Date();
  const batchingTime = parseInt(
    env("NEXT_PUBLIC_BATCH_SUBMISSION_FREQUENCY") || "0"
  );
  const stateRootProposalPeriod = parseInt(
    env("NEXT_PUBLIC_OUTPUT_ROOT_FREQUENCY") || "0"
  );
  const diff =
    dateObj.getTime() +
    Math.max(batchingTime * 1000, stateRootProposalPeriod * 1000) -
    now.getTime();
  const diffInSeconds = Math.floor(diff / 1000);
  return isNaN(diffInSeconds) ? 0 : Math.max(diffInSeconds, 0);
};
