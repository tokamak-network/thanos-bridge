import { l1Chain, l2Chain } from "@/config/network";
import {
  BridgeModeEnum,
  BridgeTokenEnum,
  BridgeTransactionInfo,
} from "@/types/bridge";
import { atom } from "jotai";

export const jotaiBridgeTransactionInfo = atom<BridgeTransactionInfo>({
  mode: BridgeModeEnum.DEPOSIT,
  fromChain: l1Chain,
  toChain: l2Chain,
  fromAddress: "",
  amount: 0,
  bridgeTokenType: BridgeTokenEnum.ETH,
});
