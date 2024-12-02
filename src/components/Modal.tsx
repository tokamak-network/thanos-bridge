import { LoadingModalComponent } from "./LoadingModal";
import { WalletOptionModal } from "./wallet-connect/WalletOptionModal";

export const Modal: React.FC = () => {
  return (
    <>
      <WalletOptionModal />
      <LoadingModalComponent />
    </>
  );
};
