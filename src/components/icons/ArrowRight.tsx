import ArrowRightIcon from "@/assets/icons/arrow/arrow-right.svg";
import Image from "next/image";

export const ArrowRightIconComponent: React.FC<{
  width?: number;
  height?: number;
}> = ({ width = 24, height = 24 }) => {
  return (
    <Image
      src={ArrowRightIcon}
      alt="arrow right icon"
      width={width}
      height={height}
    />
  );
};
