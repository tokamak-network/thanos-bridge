import { Flex, Input, Text } from "@chakra-ui/react";
interface BridgeInfoItemProps {
  title: string;
  content: string;
}
export const BridgeInfoItem: React.FC<BridgeInfoItemProps> = ({
  title,
  content,
}) => {
  return (
    <Flex flexDir={"column"} gap={"6px"}>
      <Text color={"#8C8F97"} lineHeight={"22.001px"} fontWeight={400}>
        {title}
      </Text>
      <Flex
        height={"44px"}
        padding={"0px 12px 0px 16px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        alignSelf={"stretch"}
        borderRadius={"6px"}
        background={"#1D1F25"}
      >
        <Input
          color={"#FFF"}
          fontSize={"16px"}
          fontWeight={400}
          lineHeight={"normal"}
          truncate
          maxWidth={"380px"}
          value={content}
          outline={"none"}
          border={"none"}
        />
      </Flex>
    </Flex>
  );
};
