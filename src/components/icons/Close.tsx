"use client";

import React from "react";
import CloseIcon from "@/assets/icons/arrow/close.svg";
import Image from "next/image";

export const CloseIconComponent: React.FC<{
  width?: number;
  height?: number;
}> = ({ width = 24, height = 24 }) => {
  return (
    <Image src={CloseIcon} alt="close icon" width={width} height={height} />
  );
};
