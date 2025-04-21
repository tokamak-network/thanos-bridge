"use client";

import { BridgeInfoItem } from "@/components/bridge-info/BridgeInfoItem";
import { BridgeInfoTab } from "@/components/bridge-info/BridgeInfoTab";
import { BridgeInfoEnum } from "@/types/bridge";
import { getBridgeInfoByCategory } from "@/utils/bridge-info";
import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const BridgeInfoPageContent: React.FC = () => {
  const [item, setItem] = useState<BridgeInfoEnum>(
    BridgeInfoEnum.L1_CHAIN_INFO
  );
  const bridgeInfo = useMemo(() => getBridgeInfoByCategory(item), [item]);
  return (
    <Flex w={"100%"} justifyContent={"center"}>
      <Flex
        mt={"48px"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDir={"column"}
        border={"1px solid #25282F"}
        borderRadius={"22px"}
        backgroundColor={"#101217"}
        padding={"24px"}
        gap={"8px"}
      >
        <BridgeInfoTab item={item} setItem={setItem} />
        <Flex flexDir={"column"} gap={"12px"} py={"12px"} w={"100%"}>
          {bridgeInfo
            .filter((info) => info.content)
            .map((info) => (
              <BridgeInfoItem
                title={info.title}
                content={info.content ?? ""}
                key={info.title + info.content}
              />
            ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

const BridgeInfoPage = dynamic(() => Promise.resolve(BridgeInfoPageContent), {
  ssr: false,
});

export default BridgeInfoPage;
