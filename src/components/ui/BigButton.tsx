import { ButtonProps, Spinner } from "@chakra-ui/react";
import { Button } from "./button";

interface IBigButtonComponentProps extends ButtonProps {
  content?: string;
  isLoading?: boolean;
}

export const BigButtonComponent: React.FC<IBigButtonComponentProps> = ({
  ...props
}) => {
  const { disabled, content, onClick, isLoading } = props;
  return (
    <Button
      py={"12px"}
      bgColor={disabled || isLoading ? "#4E5055" : "#0070ED"}
      width={"100%"}
      style={{
        height: "56px",
        ...props.style,
      }}
      borderRadius={"12px"}
      fontSize={"16px"}
      fontWeight={600}
      lineHeight={"normal"}
      color={isLoading ? "#25282F" : disabled ? "#BBBEC6" : "#FFFFFF"}
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
        content || ""
      )}
    </Button>
  );
};
