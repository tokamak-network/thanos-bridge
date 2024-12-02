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
  toAddress: "",
  amount: BigInt(0),
  formatted: "",
  bridgeTokenType: BridgeTokenEnum.ETH,
});

export const jotaiTokenSelectModalOpen = atom<boolean>(false);

export const jotaiIsInsufficient = atom<boolean>(false);
