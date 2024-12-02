import { ButtonProps, Text } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { ArrowDownIconComponent } from "../icons/ArrowDown";
import { TokenSymbolComponent } from "../icons/TokenSymbol";

export interface ITokenSelcectionComponentProps extends ButtonProps {
  tokenSymbol: string;
}

export const TokenSelectionComponent: React.FC<
  ITokenSelcectionComponentProps
> = ({ tokenSymbol, onClick }) => {
  return (
    <Button
      px={"8px"}
      py={"2px"}
      bgColor={"#101217"}
      borderRadius={"8px"}
      alignItems={"center"}
      gap={"8px"}
      onClick={onClick}
    >
      <TokenSymbolComponent tokenSymbol="ETH" width={25} height={25} />
      <Text fontSize={"20px"} fontWeight={500} lineHeight={"normal"}>
        {tokenSymbol}
      </Text>
      <ArrowDownIconComponent width={14} height={14} />
    </Button>
  );
};
