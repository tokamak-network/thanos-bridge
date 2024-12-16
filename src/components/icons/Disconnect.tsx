"use client";

import React from "react";
import DisconnectIcon from "@/assets/icons/network/disconnect.svg";
import Image from "next/image";

export const DisconnectIconComponent: React.FC<{
  width?: number;
  height?: number;
}> = ({ width = 24, height = 24 }) => {
  return (
    <Image
      src={DisconnectIcon}
      alt="disconnect icon"
      width={width}
      height={height}
    />
  );
};
