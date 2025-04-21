import { Chain } from "wagmi/chains";
import { Token } from "./token";
export enum BridgeModeEnum {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  NONE = "none",
}

export enum BridgeTokenEnum {
  ETH = "ETH",
  NATIVE_TOKEN = "Native Token",
  USDC = "USDC",
  ERC_20 = "ERC-20",
}

export enum BridgingStepEnum {
  INITIATE = "Initiate",
  PROVE = "Prove",
  FINALIZE = "Finalize",
}

export interface BridgeTransactionInfo {
  mode: BridgeModeEnum;
  step: BridgingStepEnum;
  fromChain: Chain;
  toChain: Chain;
  fromAddress: string;
  toAddress: string;
  amount: bigint;
  formatted: string;
  bridgeTokenType: BridgeTokenEnum;
  l1Token?: Token;
  l2Token?: Token;
}

export interface GeneralWarningModalProps {
  isOpen: boolean;
  title: string;
  description: string;
}

export enum BridgeInfoEnum {
  L1_CHAIN_INFO = "L1 Chain Info",
  L2_CHAIN_INFO = "L2 Chain Info",
  L1_CONTRACT_ADDRESS = "L1 Contract Addresses",
  OTHER_INFO = "Other Info",
}
