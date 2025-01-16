import { supportedTokens } from "@/constants/token";
import { Token } from "@/types/token";

export const getTokenInfoByChainId = (chainId: number): Token[] => {
  return supportedTokens.filter((t) => t.chainId === chainId);
};

export const getTokenInfoByAddress = (
  chainId: number,
  address?: `0x${string}`
): Token | undefined => {
  const tokenInfo = supportedTokens.find(
    (t) => t.chainId === chainId && t.address === address
  );
  return tokenInfo;
};
