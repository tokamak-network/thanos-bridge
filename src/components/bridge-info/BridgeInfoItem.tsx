import { Box, Flex, Text } from "@chakra-ui/react";
import CopyIcon from "@/assets/icons/network/copy-address.svg";
import Image from "next/image";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
interface BridgeInfoItemProps {
  title: string;
  content: string;
}
export const BridgeInfoItem: React.FC<BridgeInfoItemProps> = ({
  title,
  content,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
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
        <Text
          color={"#FFF"}
          fontSize={"16px"}
          fontWeight={400}
          lineHeight={"normal"}
          truncate
          maxWidth={"380px"}
        >
          {content}
        </Text>
        <Box cursor={"pointer"} onClick={() => copyToClipboard(content)}>
          {!isCopied ? (
            <Image src={CopyIcon} alt="copy" width={14} height={14} />
          ) : (
            <FaCheck color="white" width={14} height={14} />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
