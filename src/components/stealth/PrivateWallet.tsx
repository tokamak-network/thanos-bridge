"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Box, Text, VStack, HStack, Input, Spinner, Flex } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { keyframes, Keyframes } from "@emotion/react";
import {
  useStealthAddress,
  useStealthScanner,
  useStealthSend,
  useStealthName,
  useRelayer,
} from "@/hooks/stealth";
import { useWalletConnect } from "@/hooks/wallet-connect/useWalletConnect";
import { isStealthName, NAME_SUFFIX, GeneratedStealthAddress, ScanResult } from "@/lib/stealth";
import { RelayerInfo } from "@/lib/stealth/relayer";
import {
  ShieldIcon, LockIcon, SendIcon, InboxIcon, SettingsIcon, HomeIcon,
  CopyIcon, CheckIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon,
  WalletIcon, RefreshIcon, ArrowUpRightIcon, ArrowDownLeftIcon,
  TagIcon, TrashIcon, KeyIcon, ZapIcon, ServerIcon,
} from "./icons";

interface ColorTokens {
  bg: { page: string; card: string; input: string; elevated: string; hover: string };
  border: { default: string; light: string; accent: string; accentGreen: string };
  text: { primary: string; secondary: string; tertiary: string; muted: string };
  accent: { indigo: string; indigoBright: string; indigoDark: string; green: string; greenBright: string; greenDark: string; red: string; redDark: string; amber: string };
  glow: { indigo: string; green: string };
}

interface RadiusTokens {
  xl: string; lg: string; md: string; sm: string; xs: string;
}

interface OwnedName {
  name: string;
  fullName: string;
}

interface ClaimAddress {
  address: string;
  label?: string;
  balance?: string;
}

interface StealthPayment extends ScanResult {
  balance?: string;
  claimed?: boolean;
  keyMismatch?: boolean;
}

const colors: ColorTokens = {
  bg: { page: "#07070a", card: "#0d0d12", input: "#12121a", elevated: "#1a1a24", hover: "#22222e" },
  border: { default: "#2d2d3a", light: "#3d3d4a", accent: "#6366f1", accentGreen: "#10b981" },
  text: { primary: "#ffffff", secondary: "#e2e2e8", tertiary: "#a0a0b0", muted: "#6b6b7a" },
  accent: {
    indigo: "#7c7fff", indigoBright: "#9b9eff", indigoDark: "#5b5edd",
    green: "#00d68f", greenBright: "#00ffaa", greenDark: "#00b377",
    red: "#ff6b6b", redDark: "#ff4757", amber: "#ffbe0b",
  },
  glow: { indigo: "0 0 30px rgba(124, 127, 255, 0.3)", green: "0 0 30px rgba(0, 214, 143, 0.3)" },
};

// Minimum balance needed to cover gas for a claim transaction
// Based on 21000 gas * 1 gwei * 2x buffer = 0.000042 TON
// Using 0.0001 TON as minimum to be safe
const MIN_CLAIMABLE_BALANCE = 0.0001;

const radius: RadiusTokens = { xl: "20px", lg: "16px", md: "12px", sm: "8px", xs: "6px" };

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

type ViewType = "home" | "send" | "inbox" | "settings";

export const PrivateWallet = () => {
  const { isConnected, address } = useWalletConnect();
  const {
    stealthKeys, metaAddress, deriveKeysFromWallet, clearKeys,
    registerMetaAddress, isRegistered, isLoading: isKeyLoading,
    isSigningMessage, error: keyError,
    // Unified claim addresses
    claimAddresses, selectedClaimAddress, selectedClaimIndex, claimAddressesInitialized,
    selectClaimAddress,
  } = useStealthAddress();

  const { payments, scan, isScanning, claimPayment, error: scanError } = useStealthScanner(stealthKeys);
  const { generateAddressFor, sendEthToStealth, lastGeneratedAddress, isLoading: isSendLoading, error: sendError } = useStealthSend();
  const { ownedNames, registerName, checkAvailability, resolveName, validateName, formatName, isConfigured: nameRegistryConfigured, isLoading: isNameLoading } = useStealthName();
  const { isAvailable: isRelayerAvailable, isChecking: isCheckingRelayer, relayerInfo, withdraw: relayerWithdraw, isWithdrawing: isRelayerWithdrawing, error: relayerError, refreshRelayerInfo } = useRelayer();

  const [view, setView] = useState<ViewType>("home");
  const [copied, setCopied] = useState(false);
  const [setupStep, setSetupStep] = useState<"welcome" | "signing" | "ready">("welcome");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sendStep, setSendStep] = useState<"input" | "confirm" | "success">("input");
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [sendTxHash, setSendTxHash] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [claimingIndex, setClaimingIndex] = useState<number | null>(null);
  const [claimedTx, setClaimedTx] = useState<string | null>(null);
  const [useRelayerMode, setUseRelayerMode] = useState(false);

  const pendingPayments = payments.filter(p => !p.claimed && !p.keyMismatch && parseFloat(p.balance || "0") >= MIN_CLAIMABLE_BALANCE);

  useEffect(() => {
    const resolve = async () => {
      if (!recipient) { setResolvedAddress(null); return; }
      if (recipient.startsWith("st:")) { setResolvedAddress(recipient); return; }
      if (nameRegistryConfigured && isStealthName(recipient)) {
        setIsResolving(true);
        const resolved = await resolveName(recipient);
        setIsResolving(false);
        setResolvedAddress(resolved ? `st:thanos:${resolved}` : null);
        return;
      }
      setResolvedAddress(null);
    };
    const t = setTimeout(resolve, 300);
    return () => clearTimeout(t);
  }, [recipient, nameRegistryConfigured, resolveName]);

  useEffect(() => {
    const check = async () => {
      if (!nameInput || !nameRegistryConfigured) { setIsNameAvailable(null); return; }
      if (!validateName(nameInput).valid) { setIsNameAvailable(null); return; }
      setIsCheckingName(true);
      const available = await checkAvailability(nameInput);
      setIsNameAvailable(available);
      setIsCheckingName(false);
    };
    const t = setTimeout(check, 500);
    return () => clearTimeout(t);
  }, [nameInput, nameRegistryConfigured, validateName, checkAvailability]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSetup = async () => {
    setSetupStep("signing");
    await deriveKeysFromWallet();
    setSetupStep("ready");
  };

  const handleSendPreview = () => {
    const addr = resolvedAddress || recipient;
    if (!addr || !amount) return;
    if (generateAddressFor(addr)) setSendStep("confirm");
  };

  const handleSend = async () => {
    const hash = await sendEthToStealth(resolvedAddress || recipient, amount);
    if (hash) { setSendTxHash(hash); setSendStep("success"); }
  };

  const handleClaim = async (index: number) => {
    setClaimingIndex(index);
    const payment = payments[index];
    const claimTo = claimAddressesInitialized && selectedClaimAddress ? selectedClaimAddress.address : address;
    if (!claimTo) return;

    if (useRelayerMode && isRelayerAvailable) {
      const result = await relayerWithdraw(payment.announcement.stealthAddress, payment.stealthPrivateKey, claimTo);
      if (result?.status === 'completed' && result.txHash) setClaimedTx(result.txHash);
    } else {
      const txHash = await claimPayment(payment, claimTo);
      if (txHash) setClaimedTx(txHash);
    }
    setClaimingIndex(null);
  };

  const handleRegisterName = async () => {
    if (!metaAddress || !nameInput) return;
    const txHash = await registerName(nameInput, metaAddress);
    if (txHash) { setNameInput(""); setIsNameAvailable(null); }
  };

  const resetSendFlow = () => {
    setRecipient(""); setAmount(""); setSendStep("input");
    setSendTxHash(null); setResolvedAddress(null);
  };

  if (!isConnected) {
    return (
      <Box p="48px 32px" bgColor={colors.bg.card} borderRadius={radius.xl} border={`1px solid ${colors.border.default}`} textAlign="center">
        <VStack gap="24px">
          <Box color={colors.accent.indigo} opacity={0.9}><ShieldIcon size={48} /></Box>
          <VStack gap="8px">
            <Text fontSize="20px" fontWeight={600} color={colors.text.primary}>Private Wallet</Text>
            <Text fontSize="14px" color={colors.text.muted} maxW="280px" lineHeight="1.6">
              Send and receive payments that cannot be traced to your identity
            </Text>
          </VStack>
          <Text fontSize="13px" color={colors.text.muted}>Connect your wallet to continue</Text>
        </VStack>
      </Box>
    );
  }

  if (!stealthKeys) {
    return (
      <Box p="48px 32px" bgColor={colors.bg.card} borderRadius={radius.xl} border={`1px solid ${colors.border.default}`} animation={`${fadeIn} 0.4s ease-out`}>
        <VStack gap="32px">
          <VStack gap="16px" textAlign="center">
            <Box color={colors.accent.indigo} opacity={0.9}><KeyIcon size={44} /></Box>
            <VStack gap="8px">
              <Text fontSize="20px" fontWeight={600} color={colors.text.primary}>Activate Private Mode</Text>
              <Text fontSize="14px" color={colors.text.muted} maxW="320px" lineHeight="1.6">
                Create your private receiving address. Anyone can send to it, but only you can access the funds.
              </Text>
            </VStack>
          </VStack>

          {setupStep === "welcome" && (
            <Button h="46px" px="28px" bgColor={colors.accent.indigoDark} borderRadius={radius.sm} fontWeight={500} fontSize="14px" color="#fff"
              _hover={{ bgColor: colors.accent.indigo }} onClick={handleSetup} disabled={isKeyLoading || isSigningMessage}>
              Create Private Address
            </Button>
          )}

          {setupStep === "signing" && (
            <VStack gap="12px">
              <Spinner size="md" color={colors.accent.indigo} />
              <Text fontSize="13px" color={colors.text.muted}>Sign the message in your wallet...</Text>
            </VStack>
          )}

          {keyError && (
            <HStack gap="8px" p="12px 16px" bgColor="rgba(248, 113, 113, 0.08)" borderRadius={radius.xs}>
              <AlertCircleIcon size={16} color={colors.accent.red} />
              <Text fontSize="13px" color={colors.accent.red}>{keyError}</Text>
            </HStack>
          )}

          <Box p="14px 16px" bgColor={colors.bg.input} borderRadius={radius.sm} border={`1px solid ${colors.border.default}`}>
            <HStack gap="12px" align="flex-start">
              <Box color={colors.text.muted} flexShrink={0} mt="1px"><InfoIcon size={14} /></Box>
              <Text fontSize="12px" color={colors.text.muted} lineHeight="1.5">
                Your private address is derived from your wallet signature. You can recover it anytime by signing the same message.
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bgColor={colors.bg.card} borderRadius={radius.xl} border={`1.5px solid ${colors.border.default}`} overflow="hidden"
      animation={`${fadeIn} 0.3s ease-out`} boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)">

      {/* Header */}
      <Box p="24px" borderBottom={`1px solid ${colors.border.default}`} bgGradient="linear(180deg, rgba(124, 127, 255, 0.04) 0%, transparent 100%)">
        <Flex justify="space-between" align="flex-start">
          <VStack align="flex-start" gap="10px">
            <Text fontSize="11px" color={colors.accent.indigo} textTransform="uppercase" letterSpacing="0.12em" fontWeight={700}>Private Wallet</Text>
            <HStack gap="14px" align="center">
              {ownedNames.length > 0 ? (
                <Text fontSize="20px" fontWeight={700} color={colors.text.primary}>{ownedNames[0].fullName}</Text>
              ) : (
                <Text fontSize="14px" color={colors.text.secondary} fontFamily="'JetBrains Mono', monospace">{metaAddress?.slice(0, 18)}...</Text>
              )}
              <Button h="32px" px="14px" bgColor={copied ? "rgba(0, 214, 143, 0.2)" : colors.bg.elevated} borderRadius={radius.xs}
                border={`1.5px solid ${copied ? colors.accent.green : colors.border.light}`} fontSize="12px" fontWeight={600}
                color={copied ? colors.accent.greenBright : colors.text.secondary}
                _hover={{ bgColor: colors.accent.indigo, borderColor: colors.accent.indigo, color: "#fff" }}
                onClick={() => handleCopy(ownedNames.length > 0 ? ownedNames[0].fullName : metaAddress || "")}>
                <HStack gap="6px">
                  {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  <Text>{copied ? "Copied" : "Copy"}</Text>
                </HStack>
              </Button>
            </HStack>
            {isRegistered && (
              <HStack gap="6px">
                <CheckCircleIcon size={13} color={colors.accent.greenBright} />
                <Text fontSize="12px" color={colors.accent.greenBright} fontWeight={600}>Registered on-chain</Text>
              </HStack>
            )}
          </VStack>
          {pendingPayments.length > 0 && (
            <Button h="36px" px="16px" bgGradient="linear(135deg, rgba(255, 190, 11, 0.15) 0%, rgba(255, 190, 11, 0.05) 100%)"
              borderRadius={radius.sm} border="1.5px solid rgba(255, 190, 11, 0.5)"
              _hover={{ bgGradient: "linear(135deg, rgba(255, 190, 11, 0.25) 0%, rgba(255, 190, 11, 0.1) 100%)" }}
              onClick={() => setView("inbox")}>
              <HStack gap="8px">
                <InboxIcon size={16} color={colors.accent.amber} />
                <Text fontSize="13px" fontWeight={700} color={colors.accent.amber}>{pendingPayments.length} pending</Text>
              </HStack>
            </Button>
          )}
        </Flex>
      </Box>

      {/* Navigation */}
      <HStack p="12px 16px" gap="8px" borderBottom={`1px solid ${colors.border.default}`} bgColor={colors.bg.input}>
        {([
          { id: "home", label: "Home", Icon: HomeIcon },
          { id: "send", label: "Send", Icon: SendIcon },
          { id: "inbox", label: "Inbox", Icon: InboxIcon },
          { id: "settings", label: "Settings", Icon: SettingsIcon },
        ] as const).map((item) => (
          <Button key={item.id} flex={1} h="42px"
            bgColor={view === item.id ? colors.bg.elevated : "transparent"} borderRadius={radius.sm}
            border={view === item.id ? `1.5px solid ${colors.accent.indigo}` : "1.5px solid transparent"}
            fontWeight={view === item.id ? 600 : 500} fontSize="13px"
            color={view === item.id ? colors.text.primary : colors.text.tertiary}
            _hover={{ bgColor: colors.bg.elevated, color: colors.text.primary }}
            onClick={() => setView(item.id)}>
            <HStack gap="8px">
              <item.Icon size={18} color={view === item.id ? colors.accent.indigo : colors.text.tertiary} />
              <Text>{item.label}</Text>
              {item.id === "inbox" && pendingPayments.length > 0 && (
                <Box minW="22px" h="22px" px="6px" borderRadius="11px" bgColor={colors.accent.amber} display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="11px" fontWeight={700} color="#000">{pendingPayments.length}</Text>
                </Box>
              )}
            </HStack>
          </Button>
        ))}
      </HStack>

      {/* Content */}
      <Box p="20px">
        {view === "home" && <HomeView {...{ colors, radius, fadeIn, ownedNames, nameRegistryConfigured, nameInput, setNameInput, isCheckingName, isNameAvailable, formatName, validateName, handleRegisterName, isNameLoading, handleCopy, setView, scan, isRegistered, registerMetaAddress, isKeyLoading }} />}
        {view === "send" && <SendView {...{ colors, radius, fadeIn, sendStep, recipient, setRecipient, amount, setAmount, isResolving, resolvedAddress, handleSendPreview, handleSend, setSendStep, lastGeneratedAddress, isSendLoading, sendTxHash, resetSendFlow, sendError }} />}
        {view === "inbox" && <InboxView {...{ colors, radius, fadeIn, payments, isScanning, scan, claimAddressesInitialized, claimAddresses, selectedIndex: selectedClaimIndex, selectAddress: selectClaimAddress, handleClaim, claimingIndex, claimedTx, scanError, useRelayerMode, setUseRelayerMode, isRelayerAvailable, isCheckingRelayer, relayerInfo, refreshRelayerInfo, relayerError, isRelayerWithdrawing }} />}
        {view === "settings" && <SettingsView {...{ colors, radius, fadeIn, metaAddress, handleCopy, copied, claimAddressesInitialized, claimAddresses, clearKeys }} />}
      </Box>
    </Box>
  );
};

// Sub-component interfaces
interface HomeViewProps {
  colors: ColorTokens;
  radius: RadiusTokens;
  fadeIn: Keyframes;
  ownedNames: OwnedName[];
  nameRegistryConfigured: boolean;
  nameInput: string;
  setNameInput: (v: string) => void;
  isCheckingName: boolean;
  isNameAvailable: boolean | null;
  formatName: (name: string) => string;
  validateName: (name: string) => { valid: boolean; error?: string };
  handleRegisterName: () => void;
  isNameLoading: boolean;
  setView: (v: ViewType) => void;
  scan: () => void;
  isRegistered: boolean;
  registerMetaAddress: () => Promise<string | null>;
  isKeyLoading: boolean;
}

interface SendViewProps {
  colors: ColorTokens;
  radius: RadiusTokens;
  fadeIn: Keyframes;
  sendStep: "input" | "confirm" | "success";
  recipient: string;
  setRecipient: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  isResolving: boolean;
  resolvedAddress: string | null;
  handleSendPreview: () => void;
  handleSend: () => Promise<void>;
  setSendStep: (v: "input" | "confirm" | "success") => void;
  lastGeneratedAddress: GeneratedStealthAddress | null;
  isSendLoading: boolean;
  sendTxHash: string | null;
  resetSendFlow: () => void;
  sendError: string | null;
}

interface InboxViewProps {
  colors: ColorTokens;
  radius: RadiusTokens;
  fadeIn: Keyframes;
  payments: StealthPayment[];
  isScanning: boolean;
  scan: () => void;
  claimAddressesInitialized: boolean;
  claimAddresses: ClaimAddress[];
  selectedIndex: number;
  selectAddress: (idx: number) => void;
  handleClaim: (idx: number) => Promise<void>;
  claimingIndex: number | null;
  claimedTx: string | null;
  scanError: string | null;
  useRelayerMode: boolean;
  setUseRelayerMode: (v: boolean) => void;
  isRelayerAvailable: boolean;
  isCheckingRelayer: boolean;
  relayerInfo: RelayerInfo | null;
  refreshRelayerInfo: () => Promise<void>;
  relayerError: string | null;
  isRelayerWithdrawing: boolean;
}

interface SettingsViewProps {
  colors: ColorTokens;
  radius: RadiusTokens;
  fadeIn: Keyframes;
  metaAddress: string | null;
  handleCopy: (text: string) => void;
  copied: boolean;
  claimAddressesInitialized: boolean;
  claimAddresses: ClaimAddress[];
  clearKeys: () => void;
}

// Sub-components
const HomeView = ({ colors, radius, fadeIn, ownedNames, nameRegistryConfigured, nameInput, setNameInput, isCheckingName, isNameAvailable, formatName, validateName, handleRegisterName, isNameLoading, setView, scan, isRegistered, registerMetaAddress, isKeyLoading }: HomeViewProps) => (
  <VStack gap="16px" align="stretch" animation={`${fadeIn} 0.25s ease-out`}>
    <Box p="20px" bgGradient="linear(180deg, rgba(124, 127, 255, 0.06) 0%, transparent 100%)" borderRadius={radius.md} border={`1.5px solid ${colors.border.default}`}>
      <VStack gap="16px" align="stretch">
        <HStack justify="space-between">
          <HStack gap="10px">
            <TagIcon size={17} color={colors.accent.indigo} />
            <Text fontSize="15px" fontWeight={600} color={colors.text.primary}>Your Private Name</Text>
          </HStack>
          {ownedNames.length > 0 && (
            <Box px="10px" py="4px" bgColor="rgba(0, 214, 143, 0.15)" borderRadius={radius.xs} border="1px solid rgba(0, 214, 143, 0.4)">
              <Text fontSize="11px" color={colors.accent.greenBright} fontWeight={600}>Registered</Text>
            </Box>
          )}
        </HStack>
        {ownedNames.length > 0 ? (
          <VStack gap="10px" align="stretch">
            {ownedNames.map((name: OwnedName) => (
              <HStack key={name.name} p="14px 16px" bgColor={colors.bg.input} borderRadius={radius.sm} justify="space-between" border={`1px solid ${colors.border.default}`}>
                <Text fontSize="17px" fontWeight={700} color={colors.text.primary}>{name.fullName}</Text>
              </HStack>
            ))}
          </VStack>
        ) : nameRegistryConfigured ? (
          <VStack gap="14px" align="stretch">
            <Text fontSize="13px" color={colors.text.tertiary}>Register a name so others can send to you easily</Text>
            <HStack gap="12px">
              <Box position="relative" flex={1}>
                <Input placeholder="yourname" value={nameInput} onChange={(e: ChangeEvent<HTMLInputElement>) => setNameInput(e.target.value)} h="48px" bgColor={colors.bg.input}
                  border={`1.5px solid ${colors.border.default}`} borderRadius={radius.sm} color={colors.text.primary} fontSize="15px" px="16px" pr="55px"
                  _placeholder={{ color: colors.text.muted }} _focus={{ borderColor: colors.accent.indigo, boxShadow: colors.glow.indigo }} />
                <Text position="absolute" right="16px" top="50%" transform="translateY(-50%)" fontSize="15px" fontWeight={600} color={colors.accent.indigo}>{NAME_SUFFIX}</Text>
              </Box>
              <Button h="48px" px="24px" bgColor={colors.bg.elevated} borderRadius={radius.sm} border={`1.5px solid ${colors.border.light}`}
                fontWeight={600} fontSize="14px" color={colors.text.primary} _hover={{ bgColor: colors.accent.indigo, borderColor: colors.accent.indigo }}
                onClick={handleRegisterName} disabled={!isNameAvailable || isNameLoading || isCheckingName}>
                {isNameLoading ? <Spinner size="sm" /> : "Register"}
              </Button>
            </HStack>
            {isCheckingName && <HStack gap="6px"><Spinner size="xs" color={colors.accent.indigo} /><Text fontSize="12px" color={colors.text.secondary}>Checking...</Text></HStack>}
            {!isCheckingName && isNameAvailable === true && nameInput && (
              <HStack gap="6px"><CheckCircleIcon size={14} color={colors.accent.greenBright} /><Text fontSize="13px" color={colors.accent.greenBright} fontWeight={600}>{formatName(nameInput)} is available</Text></HStack>
            )}
            {!isCheckingName && isNameAvailable === false && nameInput && (
              <HStack gap="6px"><AlertCircleIcon size={14} color={colors.accent.red} /><Text fontSize="13px" color={colors.accent.red} fontWeight={600}>{formatName(nameInput)} is already taken</Text></HStack>
            )}
            {!isCheckingName && isNameAvailable === null && nameInput && validateName(nameInput).valid && (
              <HStack gap="6px"><AlertCircleIcon size={14} color={colors.accent.amber} /><Text fontSize="13px" color={colors.accent.amber} fontWeight={500}>Could not check availability</Text></HStack>
            )}
          </VStack>
        ) : <Text fontSize="13px" color={colors.text.muted}>Name registry not available</Text>}
      </VStack>
    </Box>

    <HStack gap="14px">
      <Button flex={1} h="72px" bgGradient="linear(135deg, rgba(124, 127, 255, 0.1) 0%, rgba(124, 127, 255, 0.02) 100%)"
        borderRadius={radius.md} border={`1.5px solid ${colors.accent.indigo}`}
        _hover={{ bgGradient: "linear(135deg, rgba(124, 127, 255, 0.18) 0%, rgba(124, 127, 255, 0.05) 100%)", boxShadow: colors.glow.indigo }}
        onClick={() => setView("send")}>
        <HStack gap="12px"><ArrowUpRightIcon size={24} color={colors.accent.indigoBright} /><Text fontSize="16px" fontWeight={600} color={colors.text.primary}>Send</Text></HStack>
      </Button>
      <Button flex={1} h="72px" bgGradient="linear(135deg, rgba(0, 214, 143, 0.1) 0%, rgba(0, 214, 143, 0.02) 100%)"
        borderRadius={radius.md} border={`1.5px solid ${colors.accent.green}`}
        _hover={{ bgGradient: "linear(135deg, rgba(0, 214, 143, 0.18) 0%, rgba(0, 214, 143, 0.05) 100%)", boxShadow: colors.glow.green }}
        onClick={() => { setView("inbox"); scan(); }}>
        <HStack gap="12px"><ArrowDownLeftIcon size={24} color={colors.accent.greenBright} /><Text fontSize="16px" fontWeight={600} color={colors.text.primary}>Receive</Text></HStack>
      </Button>
    </HStack>

    {!isRegistered && (
      <Box p="18px 20px" bgGradient="linear(135deg, rgba(124, 127, 255, 0.08) 0%, rgba(124, 127, 255, 0.02) 100%)" borderRadius={radius.md} border={`1.5px solid rgba(124, 127, 255, 0.3)`}>
        <HStack justify="space-between" align="center">
          <HStack gap="14px">
            <ShieldIcon size={22} color={colors.accent.indigoBright} />
            <VStack align="flex-start" gap="2px">
              <Text fontSize="14px" fontWeight={600} color={colors.text.primary}>Register on-chain</Text>
              <Text fontSize="12px" color={colors.text.secondary}>Let others find you by wallet address</Text>
            </VStack>
          </HStack>
          <Button h="38px" px="20px" bgColor={colors.accent.indigoDark} borderRadius={radius.sm} fontWeight={600} fontSize="13px" color="#fff"
            _hover={{ bgColor: colors.accent.indigo }} onClick={registerMetaAddress} disabled={isKeyLoading}>
            {isKeyLoading ? <Spinner size="xs" /> : "Register"}
          </Button>
        </HStack>
      </Box>
    )}
  </VStack>
);

const SendView = ({ colors, radius, fadeIn, sendStep, recipient, setRecipient, amount, setAmount, isResolving, resolvedAddress, handleSendPreview, handleSend, setSendStep, lastGeneratedAddress, isSendLoading, sendTxHash, resetSendFlow, sendError }: SendViewProps) => (
  <VStack gap="20px" align="stretch" animation={`${fadeIn} 0.25s ease-out`}>
    {sendStep === "input" && (
      <>
        <VStack gap="4px" align="flex-start">
          <Text fontSize="16px" fontWeight={600} color={colors.text.primary}>Send Private Payment</Text>
          <Text fontSize="13px" color={colors.text.muted}>Only the recipient can access these funds</Text>
        </VStack>
        <VStack gap="16px" align="stretch">
          <Box>
            <Text fontSize="12px" color={colors.text.tertiary} mb="8px" fontWeight={500}>Recipient</Text>
            <Input placeholder={`alice${NAME_SUFFIX} or st:thanos:0x...`} value={recipient} onChange={(e: ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value)}
              h="48px" bgColor={colors.bg.input} border={`1px solid ${colors.border.default}`} borderRadius={radius.sm}
              color={colors.text.primary} fontSize="14px" px="14px" _placeholder={{ color: colors.text.muted }}
              _focus={{ borderColor: colors.accent.indigo, boxShadow: colors.glow.indigo }} />
            <Box h="20px" mt="6px">
              {isResolving && <HStack gap="5px"><Spinner size="xs" color={colors.text.muted} /><Text fontSize="11px" color={colors.text.muted}>Resolving...</Text></HStack>}
              {!isResolving && resolvedAddress && !recipient.startsWith("st:") && (
                <HStack gap="5px"><CheckCircleIcon size={11} color={colors.accent.green} /><Text fontSize="11px" color={colors.accent.green}>Resolved: {resolvedAddress.slice(0, 28)}...</Text></HStack>
              )}
            </Box>
          </Box>
          <Box>
            <Text fontSize="12px" color={colors.text.tertiary} mb="8px" fontWeight={500}>Amount</Text>
            <Input placeholder="0.0" type="number" step="0.001" value={amount} onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              h="56px" bgColor={colors.bg.input} border={`1px solid ${colors.border.default}`} borderRadius={radius.sm}
              color={colors.text.primary} fontSize="24px" fontWeight={500} fontFamily="'JetBrains Mono', monospace" px="14px"
              _placeholder={{ color: colors.text.muted }} _focus={{ borderColor: colors.accent.indigo, boxShadow: colors.glow.indigo }} />
            <Text fontSize="11px" color={colors.text.muted} mt="6px">TON on Thanos</Text>
          </Box>
        </VStack>
        <Button h="48px" bgColor={colors.accent.indigoDark} borderRadius={radius.sm} fontWeight={500} fontSize="14px" color="#fff"
          _hover={{ bgColor: colors.accent.indigo }} onClick={handleSendPreview}
          disabled={(!resolvedAddress && !recipient.startsWith("st:")) || !amount || isSendLoading || isResolving}>
          Preview Payment
        </Button>
      </>
    )}

    {sendStep === "confirm" && lastGeneratedAddress && (
      <>
        <VStack gap="4px" align="flex-start">
          <Text fontSize="16px" fontWeight={600} color={colors.text.primary}>Confirm Payment</Text>
          <Text fontSize="13px" color={colors.text.muted}>Review before sending</Text>
        </VStack>
        <Box p="20px" bgColor={colors.bg.input} borderRadius={radius.md} border={`1px solid ${colors.border.default}`}>
          <VStack gap="16px" align="stretch">
            <HStack justify="space-between">
              <Text fontSize="13px" color={colors.text.muted}>Amount</Text>
              <Text fontSize="18px" fontWeight={600} color={colors.text.primary} fontFamily="'JetBrains Mono', monospace">{amount} TON</Text>
            </HStack>
            <Box h="1px" bgColor={colors.border.default} />
            <HStack justify="space-between">
              <Text fontSize="13px" color={colors.text.muted}>To</Text>
              <Text fontSize="13px" color={colors.text.primary} fontFamily="'JetBrains Mono', monospace">{recipient.includes(".tok") ? recipient : `${recipient.slice(0, 14)}...`}</Text>
            </HStack>
          </VStack>
        </Box>
        <Box p="14px 16px" bgColor="rgba(52, 211, 153, 0.04)" borderRadius={radius.sm} border="1px solid rgba(52, 211, 153, 0.1)">
          <HStack gap="10px"><LockIcon size={16} color={colors.accent.green} /><Text fontSize="12px" color={colors.text.tertiary}>This payment is private. Only the recipient can access these funds.</Text></HStack>
        </Box>
        <HStack gap="10px">
          <Button flex={1} h="44px" bgColor={colors.bg.elevated} borderRadius={radius.sm} border={`1px solid ${colors.border.default}`}
            fontWeight={500} fontSize="13px" color={colors.text.primary} _hover={{ bgColor: colors.bg.hover }} onClick={() => setSendStep("input")}>Back</Button>
          <Button flex={2} h="44px" bgColor={colors.accent.indigoDark} borderRadius={radius.sm} fontWeight={500} fontSize="13px" color="#fff"
            _hover={{ bgColor: colors.accent.indigo }} onClick={handleSend} disabled={isSendLoading}>
            {isSendLoading ? <Spinner size="sm" /> : "Send Payment"}
          </Button>
        </HStack>
      </>
    )}

    {sendStep === "success" && (
      <VStack gap="24px" py="28px" animation={`${fadeIn} 0.3s ease-out`}>
        <Box p="16px" bgColor="rgba(52, 211, 153, 0.08)" borderRadius="50%"><CheckCircleIcon size={32} color={colors.accent.green} /></Box>
        <VStack gap="6px">
          <Text fontSize="18px" fontWeight={600} color={colors.text.primary}>Payment Sent</Text>
          <Text fontSize="13px" color={colors.text.muted} textAlign="center">{amount} TON sent privately to {recipient.includes(".tok") ? recipient : "recipient"}</Text>
        </VStack>
        {sendTxHash && <Text fontSize="11px" color={colors.text.muted} fontFamily="'JetBrains Mono', monospace">tx: {sendTxHash.slice(0, 18)}...{sendTxHash.slice(-8)}</Text>}
        <Button h="44px" px="28px" bgColor={colors.accent.indigoDark} borderRadius={radius.sm} fontWeight={500} fontSize="13px" color="#fff"
          _hover={{ bgColor: colors.accent.indigo }} onClick={resetSendFlow}>Send Another</Button>
      </VStack>
    )}

    {sendError && (
      <HStack gap="6px" p="12px 14px" bgColor="rgba(248, 113, 113, 0.08)" borderRadius={radius.xs}>
        <AlertCircleIcon size={14} color={colors.accent.red} /><Text fontSize="12px" color={colors.accent.red}>{sendError}</Text>
      </HStack>
    )}
  </VStack>
);

const InboxView = ({ colors, radius, fadeIn, payments, isScanning, scan, claimAddressesInitialized, claimAddresses, selectedIndex, selectAddress, handleClaim, claimingIndex, claimedTx, scanError, useRelayerMode, setUseRelayerMode, isRelayerAvailable, isCheckingRelayer, relayerInfo, refreshRelayerInfo, relayerError, isRelayerWithdrawing }: InboxViewProps) => (
  <VStack gap="20px" align="stretch" animation={`${fadeIn} 0.25s ease-out`}>
    <HStack justify="space-between" align="center">
      <VStack gap="4px" align="flex-start">
        <Text fontSize="18px" fontWeight={600} color={colors.text.primary}>Inbox</Text>
        <Text fontSize="14px" color={colors.text.muted}>Private payments sent to you</Text>
      </VStack>
      <Button h="36px" px="14px" bgColor={colors.accent.indigoDark} borderRadius={radius.xs} fontWeight={500} fontSize="12px" color="#fff"
        _hover={{ bgColor: colors.accent.indigo }} onClick={() => scan()} disabled={isScanning}>
        {isScanning ? <HStack gap="6px"><Spinner size="xs" /><Text>Scanning...</Text></HStack> : <HStack gap="6px"><RefreshIcon size={13} /><Text>Refresh</Text></HStack>}
      </Button>
    </HStack>

    {claimAddressesInitialized && claimAddresses.length > 0 && (
      <Box p="16px" bgColor={colors.bg.input} borderRadius={radius.md} border={`1px solid ${colors.border.default}`}>
        <Text fontSize="12px" color={colors.text.muted} mb="10px" fontWeight={500}>Claim to:</Text>
        <HStack gap="8px" flexWrap="wrap">
          {claimAddresses.slice(0, 3).map((addr: ClaimAddress, idx: number) => (
            <Button key={addr.address} h="34px" px="14px" bgColor={selectedIndex === idx ? colors.accent.indigo : colors.bg.page}
              borderRadius={radius.xs} border={`1px solid ${selectedIndex === idx ? colors.accent.indigo : colors.border.default}`}
              fontSize="13px" fontWeight={500} color={selectedIndex === idx ? colors.text.primary : colors.text.tertiary}
              _hover={{ bgColor: selectedIndex === idx ? colors.accent.indigo : colors.bg.hover }} onClick={() => selectAddress(idx)}>
              {addr.label || `Wallet ${idx + 1}`}
            </Button>
          ))}
        </HStack>
      </Box>
    )}

    <Box p="16px" bgColor={colors.bg.input} borderRadius={radius.md} border={`1px solid ${useRelayerMode && isRelayerAvailable ? colors.accent.indigo : colors.border.default}`}>
      <HStack justify="space-between" align="center">
        <HStack gap="12px">
          <Box p="8px" bgColor={useRelayerMode && isRelayerAvailable ? "rgba(124, 127, 255, 0.15)" : colors.bg.elevated} borderRadius={radius.xs}>
            <ZapIcon size={18} color={useRelayerMode && isRelayerAvailable ? colors.accent.indigoBright : colors.text.muted} />
          </Box>
          <VStack align="flex-start" gap="2px">
            <HStack gap="8px">
              <Text fontSize="14px" fontWeight={500} color={colors.text.primary}>Private Claim</Text>
              {isCheckingRelayer && <Spinner size="xs" color={colors.text.muted} />}
              {!isCheckingRelayer && !isRelayerAvailable && <Box px="6px" py="2px" bgColor="rgba(255, 107, 107, 0.1)" borderRadius="4px"><Text fontSize="10px" color={colors.accent.red} fontWeight={600}>Offline</Text></Box>}
              {!isCheckingRelayer && isRelayerAvailable && <Box px="6px" py="2px" bgColor="rgba(0, 214, 143, 0.1)" borderRadius="4px"><Text fontSize="10px" color={colors.accent.green} fontWeight={600}>Online</Text></Box>}
            </HStack>
            <Text fontSize="12px" color={colors.text.muted}>{useRelayerMode && isRelayerAvailable ? `Relayer hides your identity (${relayerInfo?.feeBps ? relayerInfo.feeBps / 100 : 0.5}% fee)` : "Use relayer to hide sender identity"}</Text>
          </VStack>
        </HStack>
        <Button h="34px" px="14px" bgColor={useRelayerMode ? colors.accent.indigo : colors.bg.elevated} borderRadius={radius.xs}
          border={`1px solid ${useRelayerMode ? colors.accent.indigo : colors.border.light}`} fontWeight={500} fontSize="12px"
          color={useRelayerMode ? "#fff" : colors.text.secondary} _hover={{ bgColor: useRelayerMode ? colors.accent.indigoDark : colors.bg.hover }}
          onClick={() => isRelayerAvailable ? setUseRelayerMode(!useRelayerMode) : refreshRelayerInfo()} disabled={isCheckingRelayer}>
          {isCheckingRelayer ? "Checking..." : useRelayerMode ? "Enabled" : isRelayerAvailable ? "Enable" : "Retry"}
        </Button>
      </HStack>
      {useRelayerMode && isRelayerAvailable && relayerInfo && (
        <Box mt="12px" p="10px 12px" bgColor={colors.bg.page} borderRadius={radius.xs} border={`1px solid ${colors.border.default}`}>
          <HStack gap="16px" fontSize="11px" color={colors.text.muted}>
            <HStack gap="4px"><ServerIcon size={12} /><Text>Relayer: {relayerInfo.relayerAddress.slice(0, 8)}...</Text></HStack>
            <Text>Fee: {relayerInfo.feeBps / 100}%</Text>
          </HStack>
        </Box>
      )}
      {relayerError && (
        <Box mt="12px" p="10px 12px" bgColor="rgba(255, 107, 107, 0.08)" borderRadius={radius.xs}>
          <HStack gap="6px"><AlertCircleIcon size={12} color={colors.accent.red} /><Text fontSize="11px" color={colors.accent.red}>{relayerError}</Text></HStack>
        </Box>
      )}
    </Box>

    {payments.length === 0 ? (
      <Box p="56px 24px" bgColor={colors.bg.input} borderRadius={radius.lg} border={`1px solid ${colors.border.default}`} textAlign="center">
        <VStack gap="14px">
          <Box color={colors.text.muted}><InboxIcon size={44} /></Box>
          <VStack gap="6px">
            <Text fontSize="16px" fontWeight={500} color={colors.text.primary}>No payments yet</Text>
            <Text fontSize="14px" color={colors.text.muted} maxW="260px">When someone sends you a private payment, it will appear here</Text>
          </VStack>
        </VStack>
      </Box>
    ) : (
      <VStack gap="12px" align="stretch">
        {payments.map((payment: StealthPayment, index: number) => {
          const balance = parseFloat(payment.balance || "0");
          const isTooLowForGas = balance > 0 && balance < MIN_CLAIMABLE_BALANCE;

          return (
            <Box key={payment.announcement.txHash} p="20px" bgColor={colors.bg.input} borderRadius={radius.lg}
              border={`1px solid ${payment.claimed ? colors.border.default : payment.keyMismatch || isTooLowForGas ? colors.border.default : colors.accent.greenDark}`}
              opacity={payment.claimed || isTooLowForGas ? 0.6 : 1}>
              <HStack justify="space-between" align="flex-start">
                <VStack align="flex-start" gap="6px">
                  <Text fontSize="22px" fontWeight={600} color={colors.text.primary} fontFamily="'JetBrains Mono', monospace">{balance.toFixed(4)} TON</Text>
                  <Text fontSize="12px" color={colors.text.muted}>Block #{payment.announcement.blockNumber.toLocaleString()}</Text>
                </VStack>
                {payment.claimed ? (
                  <Box px="12px" py="6px" bgColor="rgba(74, 222, 128, 0.1)" borderRadius={radius.xs}>
                    <HStack gap="6px"><CheckCircleIcon size={14} color={colors.accent.green} /><Text fontSize="13px" fontWeight={500} color={colors.accent.green}>Claimed</Text></HStack>
                  </Box>
                ) : payment.keyMismatch ? (
                  <Box px="12px" py="6px" bgColor="rgba(239, 68, 68, 0.1)" borderRadius={radius.xs}>
                    <HStack gap="6px"><AlertCircleIcon size={14} color={colors.accent.red} /><Text fontSize="13px" fontWeight={500} color={colors.accent.red}>Cannot Claim</Text></HStack>
                  </Box>
                ) : isTooLowForGas ? (
                  <Box px="12px" py="6px" bgColor="rgba(255, 190, 11, 0.1)" borderRadius={radius.xs}>
                    <HStack gap="6px"><AlertCircleIcon size={14} color={colors.accent.amber} /><Text fontSize="13px" fontWeight={500} color={colors.accent.amber}>Dust</Text></HStack>
                  </Box>
                ) : (
                  <Button h="40px" px="22px" bgColor={useRelayerMode && isRelayerAvailable ? colors.accent.indigo : colors.accent.green}
                    borderRadius={radius.xs} fontWeight={500} fontSize="14px" color={useRelayerMode && isRelayerAvailable ? "#fff" : colors.bg.page}
                    _hover={{ bgColor: useRelayerMode && isRelayerAvailable ? colors.accent.indigoDark : colors.accent.greenDark }}
                    onClick={() => handleClaim(index)} disabled={claimingIndex === index || isRelayerWithdrawing}>
                    {claimingIndex === index ? <HStack gap="6px"><Spinner size="sm" /><Text>{useRelayerMode ? "Relaying..." : "Claiming..."}</Text></HStack>
                      : <HStack gap="6px">{useRelayerMode && isRelayerAvailable && <ZapIcon size={14} />}<Text>{useRelayerMode && isRelayerAvailable ? "Private Claim" : "Claim"}</Text></HStack>}
                  </Button>
                )}
              </HStack>
              {payment.keyMismatch && (
                <Box mt="14px" p="12px" bgColor="rgba(239, 68, 68, 0.05)" borderRadius={radius.xs}>
                  <Text fontSize="12px" color="#fca5a5" lineHeight="1.5">Your current keys don&apos;t match this payment.</Text>
                </Box>
              )}
              {isTooLowForGas && !payment.claimed && (
                <Box mt="14px" p="12px" bgColor="rgba(255, 190, 11, 0.05)" borderRadius={radius.xs}>
                  <Text fontSize="12px" color={colors.accent.amber} lineHeight="1.5">Balance too low to cover gas fees (~{MIN_CLAIMABLE_BALANCE} TON required).</Text>
                </Box>
              )}
            </Box>
          );
        })}
      </VStack>
    )}

    {claimedTx && (
      <Box p="14px 16px" bgColor="rgba(74, 222, 128, 0.1)" borderRadius={radius.xs} border="1px solid rgba(74, 222, 128, 0.2)">
        <HStack gap="8px"><CheckCircleIcon size={14} color={colors.accent.green} /><Text fontSize="13px" color={colors.accent.green}>Claimed! tx: {claimedTx.slice(0, 18)}...</Text></HStack>
      </Box>
    )}

    {scanError && (
      <HStack gap="8px" p="14px 16px" bgColor="rgba(239, 68, 68, 0.1)" borderRadius={radius.xs}>
        <AlertCircleIcon size={16} color={colors.accent.red} /><Text fontSize="13px" color={colors.accent.red}>{scanError}</Text>
      </HStack>
    )}
  </VStack>
);

const SettingsView = ({ colors, radius, fadeIn, metaAddress, handleCopy, copied, claimAddressesInitialized, claimAddresses, clearKeys }: SettingsViewProps) => (
  <VStack gap="20px" align="stretch" animation={`${fadeIn} 0.25s ease-out`}>
    <VStack gap="4px" align="flex-start">
      <Text fontSize="18px" fontWeight={600} color={colors.text.primary}>Settings</Text>
      <Text fontSize="14px" color={colors.text.muted}>Manage your private wallet</Text>
    </VStack>

    <Box p="20px" bgColor={colors.bg.input} borderRadius={radius.lg} border={`1px solid ${colors.border.default}`}>
      <VStack gap="14px" align="stretch">
        <HStack gap="10px"><KeyIcon size={16} color={colors.text.muted} /><Text fontSize="13px" color={colors.text.muted} fontWeight={500}>Private Address</Text></HStack>
        <Box p="14px 16px" bgColor={colors.bg.page} borderRadius={radius.md} border={`1px solid ${colors.border.default}`}>
          <Text fontSize="12px" color={colors.text.tertiary} fontFamily="'JetBrains Mono', monospace" wordBreak="break-all" lineHeight="1.6">{metaAddress}</Text>
        </Box>
        <Button h="40px" bgColor={colors.bg.page} borderRadius={radius.xs} border={`1px solid ${colors.border.default}`}
          fontWeight={500} fontSize="13px" color={colors.text.primary} _hover={{ bgColor: colors.bg.hover }} onClick={() => handleCopy(metaAddress || "")}>
          <HStack gap="8px">{copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}<Text>{copied ? "Copied" : "Copy Address"}</Text></HStack>
        </Button>
      </VStack>
    </Box>

    {claimAddressesInitialized && (
      <Box p="20px" bgColor={colors.bg.input} borderRadius={radius.lg} border={`1px solid ${colors.border.default}`}>
        <VStack gap="14px" align="stretch">
          <HStack gap="10px"><WalletIcon size={16} color={colors.text.muted} /><Text fontSize="13px" color={colors.text.muted} fontWeight={500}>Claim Addresses</Text></HStack>
          {claimAddresses.map((addr: ClaimAddress, idx: number) => (
            <HStack key={addr.address} p="14px 16px" bgColor={colors.bg.page} borderRadius={radius.md} justify="space-between">
              <VStack align="flex-start" gap="3px">
                <Text fontSize="14px" fontWeight={500} color={colors.text.primary}>{addr.label || `Wallet ${idx + 1}`}</Text>
                <Text fontSize="11px" color={colors.text.muted} fontFamily="'JetBrains Mono', monospace">{addr.address.slice(0, 14)}...{addr.address.slice(-10)}</Text>
              </VStack>
              <Text fontSize="14px" fontWeight={500} color={colors.accent.green} fontFamily="'JetBrains Mono', monospace">{parseFloat(addr.balance || "0").toFixed(4)} TON</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    )}

    <Box p="20px" bgColor="rgba(239, 68, 68, 0.03)" borderRadius={radius.lg} border="1px solid rgba(239, 68, 68, 0.12)">
      <VStack gap="14px" align="stretch">
        <HStack gap="10px"><TrashIcon size={16} color={colors.accent.red} /><Text fontSize="13px" color={colors.accent.red} fontWeight={500}>Danger Zone</Text></HStack>
        <Button h="44px" bgColor="rgba(239, 68, 68, 0.1)" borderRadius={radius.xs} fontWeight={500} fontSize="14px" color={colors.accent.red}
          border="1px solid rgba(239, 68, 68, 0.2)" _hover={{ bgColor: "rgba(239, 68, 68, 0.15)" }} onClick={clearKeys}>Reset Private Wallet</Button>
        <Text fontSize="12px" color={colors.text.muted}>This will clear your keys. You can recover them by signing with the same wallet.</Text>
      </VStack>
    </Box>
  </VStack>
);
