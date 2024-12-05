import Image from "next/image";
import React from "react";
import { ChainLayerEnum } from "@/types/network";
import L1NetworkIcon from "@/assets/icons/network/l1-network.svg";
import L2NetworkIcon from "@/assets/icons/network/l2-network.svg";
import UnknownNetworkIcon from "@/assets/icons/network/wrong-network.svg";

export interface INetworkSymbolComponentProps {
  width?: number;
  height?: number;
  networkLayer: ChainLayerEnum;
}

export const NetworkSymbolComponent: React.FC<INetworkSymbolComponentProps> = ({
  networkLayer,
  ...props
}) => {
  const getNetworkIcon = (layer: ChainLayerEnum) => {
    switch (layer) {
      case ChainLayerEnum.L1:
        return L1NetworkIcon;
      case ChainLayerEnum.L2:
        return L2NetworkIcon;
      default:
        return UnknownNetworkIcon;
    }
  };

  return (
    <Image {...props} src={getNetworkIcon(networkLayer)} alt={networkLayer} />
  );
};
