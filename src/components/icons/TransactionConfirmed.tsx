"use client";

import React from "react";
import TransactionConfirmedIcon from "@/assets/icons/transaction/success.svg";
import Image from "next/image";

export const TransactionConfirmedIconComponent: React.FC<{
  width?: number;
  height?: number;
}> = ({ width = 24, height = 24 }) => {
  return (
    <Image
      src={TransactionConfirmedIcon}
      alt="transaction confirmed icon"
      width={width}
      height={height}
    />
  );
};
