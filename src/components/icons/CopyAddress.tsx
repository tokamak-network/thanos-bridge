"use client";

import React from "react";
import CopyAddressIcon from "@/assets/icons/network/copy-address.svg";
import Image from "next/image";

export const CopyAddressIconComponent: React.FC<{
  width?: number;
  height?: number;
}> = ({ width = 24, height = 24 }) => {
  return (
    <Image
      src={CopyAddressIcon}
      alt="Copy Address icon"
      width={width}
      height={height}
    />
  );
};
