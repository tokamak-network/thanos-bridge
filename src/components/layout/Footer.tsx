import { Flex, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Flex
      h={"64px"}
      justifyContent={"center"}
      alignItems={"center"}
      bottom={0}
      position={"absolute"}
      width={"100%"}
    >
      <Text color={"#76819B"} fontSize={"12px"} lineHeight={"normal"}>
        Copyright © 2024. All rights reserved.
      </Text>
    </Flex>
  );
};
