import { BigNumberish } from "ethers";
import { Chain } from "wagmi/chains";
export enum BridgeModeEnum {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  NONE = "none",
}

export enum BridgeTokenEnum {
  ETH = "ETH",
  NATIVE_TOKEN = "Native Token",
  ERC_20 = "ERC-20",
}

export interface BridgeTransactionInfo {
  mode: BridgeModeEnum;
  fromChain: Chain;
  toChain: Chain;
  fromAddress: string;
  toAddress?: string;
  amount: BigNumberish;
  bridgeTokenType: BridgeTokenEnum;
  l1TokenAddress?: string;
  l2TokenAddress?: string;
}
