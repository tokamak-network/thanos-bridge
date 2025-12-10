import Image from "next/image";
import React from "react";
import EthereumIcon from "@/assets/icons/token/ethereum.svg";
import USDTIcon from "@/assets/icons/token/usdt.svg";
import USDCIcon from "@/assets/icons/token/usdc.svg";
import NativeTokenIcon from "@/assets/icons/token/TN-64.svg";

export interface ITokenSymbolComponentProps {
  width?: number;
  height?: number;
  tokenSymbol: string;
}

export const TokenSymbolComponent: React.FC<ITokenSymbolComponentProps> = ({
  tokenSymbol,
  ...props
}) => {
  const getTokenIcon = (symbol: string) => {
    switch (symbol.toUpperCase()) {
      case "ETH":
        return EthereumIcon;
      case "USDT":
        return USDTIcon;
      case "USDC":
        return USDCIcon;
      default:
        return NativeTokenIcon;
    }
  };

  return <Image {...props} src={getTokenIcon(tokenSymbol)} alt={tokenSymbol} />;
};
