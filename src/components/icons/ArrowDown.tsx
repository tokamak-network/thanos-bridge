import ArrowDownIcon from "@/assets/icons/arrow/arrow-down.svg";
import Image from "next/image";

export const ArrowDownIconComponent: React.FC<{
  width?: number;
  height?: number;
}> = ({ width = 24, height = 24 }) => {
  return (
    <Image
      src={ArrowDownIcon}
      alt="arrow down icon"
      width={width}
      height={height}
    />
  );
};
