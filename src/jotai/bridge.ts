import { l1Chain, l2Chain } from "@/config/network";
import {
  BridgeModeEnum,
  BridgeTokenEnum,
  BridgeTransactionInfo,
  BridgingStepEnum,
  GeneralWarningModalProps,
} from "@/types/bridge";
import { TransactionStatusEnum } from "@/types/transaction";
import { TransactionConfirmModalProps } from "@/types/transaction";
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
  step: BridgingStepEnum.INITIATE,
});

export const jotaiTokenSelectModalOpen = atom<boolean>(false);

export const jotaiInvalidRPCWarningModalOpen = atom<boolean>(false);

export const jotaiGeneralWarningModal = atom<GeneralWarningModalProps>({
  isOpen: false,
  title: "",
  description: "",
});

export const jotaiIsInsufficient = atom<boolean>(false);

export const jotaiTransactionConfirmModalStatus =
  atom<TransactionConfirmModalProps>({
    isOpen: false,
    status: TransactionStatusEnum.NONE,
    mode: BridgeModeEnum.DEPOSIT,
  });
