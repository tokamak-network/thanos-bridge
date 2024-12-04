import { ButtonProps, Spinner } from "@chakra-ui/react";
import { Button } from "../ui/button";

interface IDepositButtonComponentProps extends ButtonProps {
  content?: string;
  isLoading?: boolean;
}

export const DepositButtonComponent: React.FC<IDepositButtonComponentProps> = ({
  ...props
}) => {
  const { disabled, content, onClick, isLoading } = props;
  return (
    <Button
      py={"16px"}
      bgColor={disabled || isLoading ? "#25282F" : "#0070ED"}
      width={"100%"}
      height={"24px"}
      borderRadius={"12px"}
      fontSize={"16px"}
      fontWeight={600}
      lineHeight={"normal"}
      color={disabled ? "#BBBEC6" : "#FFFFFF"}
      boxSizing={"content-box"}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <Spinner
          width={"24px"}
          height={"24px"}
          color={"#0070ED"}
          borderWidth={"2px"}
          animationDuration={"1s"}
          css={{ "--spinner-track-color": "#25282F" }}
        />
      ) : (
        (content ?? "Deposit")
      )}
    </Button>
  );
};
