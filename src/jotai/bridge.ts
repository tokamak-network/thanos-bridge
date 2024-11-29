import { BridgeEnum } from "@/types/bridge";
import { atom } from "jotai";

export const bridgeStatus = atom<BridgeEnum>(BridgeEnum.DEPOSIT);
