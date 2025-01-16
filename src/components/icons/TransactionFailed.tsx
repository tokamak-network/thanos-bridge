"use client";

import React from "react";
import TransactionFailedIcon from "@/assets/icons/transaction/error.svg";
import Image from "next/image";

export const TransactionFailedIconComponent: React.FC<{
  width?: number;
  height?: number;
}> = ({ width = 24, height = 24 }) => {
  return (
    <Image
      src={TransactionFailedIcon}
      alt="transaction failed icon"
      width={width}
      height={height}
    />
  );
};
