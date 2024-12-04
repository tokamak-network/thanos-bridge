import { BridgeModeEnum } from "./bridge";

export enum TransactionStatusEnum {
  NONE = "none",
  READY_TO_CONFIRM = "ready_to_confirm",
  CONFIRMING = "confirming",
  SUCCESS = "success",
  ERROR = "error",
}

export interface TransactionConfirmModalProps {
  isOpen: boolean;
  status: TransactionStatusEnum;
  mode: BridgeModeEnum;
  txHash?: string;
}
