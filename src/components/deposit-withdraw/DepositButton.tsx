import { ButtonProps } from "@chakra-ui/react";
import { Button } from "../ui/button";

interface IDepositButtonComponentProps extends ButtonProps {
  content?: string;
}

export const DepositButtonComponent: React.FC<IDepositButtonComponentProps> = ({
  ...props
}) => {
  const { disabled, content, onClick } = props;
  return (
    <Button
      py={"16px"}
      bgColor={disabled ? "#4E5055" : "#0070ED"}
      width={"100%"}
      height={"24px"}
      borderRadius={"12px"}
      fontSize={"16px"}
      fontWeight={600}
      lineHeight={"normal"}
      color={disabled ? "#BBBEC6" : "#FFFFFF"}
      boxSizing={"content-box"}
      disabled={disabled}
      onClick={onClick}
    >
      {content ?? "Deposit"}
    </Button>
  );
};
