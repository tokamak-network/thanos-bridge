// "use client";

// import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
// import { Button } from "../ui/button";
// import { useEnsName } from "wagmi";
// import { useModal } from "@/contexts/modalContext";

// export const Account = () => {
//   const { address, isConnected, disconnect, connect, connectors } =
//     useWalletConnect();
//   const { data: ensName } = useEnsName({ address });
//   return (
//     <Button
//       px={"12px"}
//       py={"8px"}
//       bgColor={"#101217"}
//       borderRadius={"8px"}
//       border={"1px solid #555A64"}
//       fontWeight={500}
//       fontSize={"16px"}
//     >
//       {isConnected ? ensName : "Connect Wallet"}
//     </Button>
//   );
// };
