import { WalletOptionModal } from "../wallet-connect/WalletOptionModal";
import { GeneralWarningModalComponent } from "./GeneralWarningModal";
import { InvalidRPCWarningModalComponent } from "./InvalidRPCWarningModal";
import { LoadingModalComponent } from "./LoadingModal";
import { TokenSelectionModalComponent } from "./TokenSelectionModal";
import { TransactionConfirmModalComponent } from "./TransactionConfirmModal";

export const Modal: React.FC = () => {
  return (
    <>
      <WalletOptionModal />
      <LoadingModalComponent />
      <TransactionConfirmModalComponent />
      <TokenSelectionModalComponent />
      <InvalidRPCWarningModalComponent />
      <GeneralWarningModalComponent />
    </>
  );
};
