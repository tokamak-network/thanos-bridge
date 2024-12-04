export enum TransactionStatusEnum {
  CONFIRMING = "confirming",
  SUCCESS = "success",
  ERROR = "error",
}

export interface TransactionConfirmModalProps {
  isOpen: boolean;
  status: TransactionStatusEnum;
  txHash?: string;
}
