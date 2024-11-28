// "use client";

// import { Flex, Text } from "@chakra-ui/react";
// import { useRouter, usePathname } from "next/navigation";
// import { Account } from "../wallet-connect/Account";
// export const GNBComponent = () => {
//   const router = useRouter();
//   const pathName = usePathname();
//   return (
//     <Flex
//       height={"80px"}
//       justifyContent={"space-between"}
//       alignItems={"center"}
//       px={"32px"}
//       py={"20px"}
//     >
//       <Flex></Flex>
//       <Flex gap={"48px"}>
//         <Text
//           fontSize={"16px"}
//           fontWeight={500}
//           lineHeight={"24px"}
//           cursor={"pointer"}
//           color={pathName.includes("bridge") ? "#FFFFFF" : "#8C8F97"}
//           onClick={() => router.push("/bridge")}
//         >
//           Bridge
//         </Text>
//         <Text
//           fontSize={"16px"}
//           fontWeight={500}
//           lineHeight={"24px"}
//           cursor={"pointer"}
//           color={pathName.includes("account") ? "#FFFFFF" : "#8C8F97"}
//           onClick={() => router.push("/account")}
//         >
//           Account
//         </Text>
//       </Flex>
//       <Flex>
//         <Account />
//       </Flex>
//     </Flex>
//   );
// };
