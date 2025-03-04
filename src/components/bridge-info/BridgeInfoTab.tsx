import { BridgeInfoEnum } from "@/types/bridge";
import { Flex, Text } from "@chakra-ui/react";

interface BridgeInfoTabProps {
  item: BridgeInfoEnum;
  setItem: (item: BridgeInfoEnum) => void;
}

export const BridgeInfoTab: React.FC<BridgeInfoTabProps> = ({
  item,
  setItem,
}) => {
  return (
    <Flex
      height={"48px"}
      alignItems={"center"}
      justifyContent={"space-between"}
      alignSelf={"stretch"}
      borderRadius={"32px"}
      backgroundColor={"#000710"}
      border={"1px solid #25282F"}
    >
      {Object.values(BridgeInfoEnum).map((value) => (
        <Text
          height={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          py={"8px"}
          px={"15px"}
          fontSize={"14px"}
          fontWeight={500}
          lineHeight={"normal"}
          key={value}
          textAlign={"center"}
          whiteSpace={"nowrap"}
          color={item === value ? "#0070ED" : "#8C8F97"}
          borderRadius={"32px"}
          cursor={"pointer"}
          onClick={() => setItem(value)}
          border={item === value ? "1px solid #0070ED" : ""}
        >
          {value}
        </Text>
      ))}
    </Flex>
  );
};
