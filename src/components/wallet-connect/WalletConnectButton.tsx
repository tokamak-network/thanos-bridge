import { walletConnectModalOpenedStatus } from "@/jotai/wallet-connect";
import { Button } from "../ui/button";
import { useAtom } from "jotai";

export const WalletConnectButtonComponent: React.FC = () => {
  const [, setIsOpen] = useAtom(walletConnectModalOpenedStatus);
  return (
    <Button
      py={"16px"}
      bgColor={"#4E5055"}
      width={"100%"}
      height={"24px"}
      onClick={() => setIsOpen(true)}
      borderRadius={"12px"}
      fontSize={"16px"}
      fontWeight={600}
      lineHeight={"normal"}
      color={"#BBBEC6"}
      boxSizing={"content-box"}
    >
      Connect Wallet
    </Button>
  );
};
