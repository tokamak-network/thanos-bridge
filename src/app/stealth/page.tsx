"use client";

import { Flex, Box, Text, VStack } from "@chakra-ui/react";
import { PrivateWallet } from "@/components/stealth/PrivateWallet";
import { WalletConnectButtonComponent } from "@/components/wallet-connect/WalletConnectButton";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import dynamic from "next/dynamic";

// Design tokens from CrossTrade
const colors = {
  bg: {
    page: "#0e0e10",
    card: "#131316",
  },
  text: {
    primary: "#ffffff",
    secondary: "#e4e4e7",
    muted: "#71717a",
  },
  accent: {
    indigo: "#6366f1",
  },
  border: {
    default: "#2a2a2e",
  },
};

// Shield icon
const ShieldCheckIcon = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const StealthPageContent: React.FC = () => {
  const { isConnected } = useWalletConnect();

  return (
    <Box minH="100vh" bgColor={colors.bg.page} position="relative">
      {/* Main content */}
      <Flex w="100%" justifyContent="center" position="relative" zIndex={1}>
        <Flex
          py="48px"
          px="16px"
          gap="28px"
          flexDir="column"
          alignItems="center"
          maxW="500px"
          w="100%"
        >
          {/* Header */}
          <VStack gap="12px" textAlign="center">
            <Box color={colors.accent.indigo}>
              <ShieldCheckIcon size={36} />
            </Box>
            <VStack gap="6px">
              <Text
                fontSize="26px"
                fontWeight={600}
                color={colors.text.primary}
                letterSpacing="-0.02em"
              >
                Private Wallet
              </Text>
              <Text fontSize="14px" color={colors.text.muted} lineHeight="1.5">
                Send and receive untraceable payments
              </Text>
            </VStack>
          </VStack>

          {/* Wallet Connect */}
          {!isConnected && (
            <Box w="100%">
              <WalletConnectButtonComponent />
            </Box>
          )}

          {/* Main Wallet Interface */}
          <Box w="100%">
            <PrivateWallet />
          </Box>

          {/* How it works */}
          <Box
            p="20px 24px"
            bgColor={colors.bg.card}
            borderRadius="16px"
            border={`1px solid ${colors.border.default}`}
            w="100%"
          >
            <VStack gap="16px" align="stretch">
              <Text fontSize="13px" fontWeight={500} color={colors.text.muted} textTransform="uppercase" letterSpacing="0.08em">
                How it works
              </Text>
              <VStack gap="14px" align="stretch">
                <StepItem
                  number={1}
                  title="Share your address"
                  description="Give your private address or .tok name to the sender"
                />
                <StepItem
                  number={2}
                  title="They send privately"
                  description="Each payment creates a unique, unlinkable address"
                />
                <StepItem
                  number={3}
                  title="Check your inbox"
                  description="Scan for payments and claim to your wallet"
                />
              </VStack>
            </VStack>
          </Box>

          {/* Network badge */}
          <Box
            px="16px"
            py="8px"
            bgColor={colors.bg.card}
            borderRadius="8px"
            border={`1px solid ${colors.border.default}`}
          >
            <Text fontSize="12px" color={colors.text.muted}>
              Powered by <Text as="span" color={colors.accent.indigo} fontWeight={500}>Thanos Network</Text>
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

// Step item component
const StepItem = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <Flex gap="14px" align="flex-start">
    <Box
      w="26px"
      h="26px"
      borderRadius="8px"
      bgColor="#1a1a1d"
      border="1px solid #2a2a2e"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      <Text fontSize="12px" fontWeight={600} color="#71717a">
        {number}
      </Text>
    </Box>
    <VStack align="flex-start" gap="3px">
      <Text fontSize="14px" fontWeight={500} color="#ffffff">
        {title}
      </Text>
      <Text fontSize="13px" color="#71717a" lineHeight="1.4">
        {description}
      </Text>
    </VStack>
  </Flex>
);

const StealthPage = dynamic(() => Promise.resolve(StealthPageContent), {
  ssr: false,
});

export default StealthPage;
