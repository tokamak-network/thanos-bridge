import { WalletOptionModal } from "../wallet-connect/WalletOptionModal";
import { LoadingModalComponent } from "./LoadingModal";
import { TokenSelectionModalComponent } from "./TokenSelectionModal";

export const Modal: React.FC = () => {
  return (
    <>
      <WalletOptionModal />
      <LoadingModalComponent />
      <TokenSelectionModalComponent />
    </>
  );
};
