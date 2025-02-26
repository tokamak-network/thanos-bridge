import { supportedTokens } from "@/constants/token";
import { Token } from "@/types/token";
import { l1Chain, l2Chain } from "@/config/network";
export const getTokenInfoByChainId = (chainId: number): Token[] => {
  const destinationChainId = chainId === l1Chain.id ? l2Chain.id : l1Chain.id;
  return supportedTokens.filter((t) => {
    const destinationToken = supportedTokens.find(
      (dt) =>
        dt.chainId === destinationChainId &&
        dt.bridgedTokenSymbol === t.bridgedTokenSymbol
    );
    if (
      t.chainId === chainId &&
      ((t.address && destinationToken?.address) ||
        t.isNativeCurrency ||
        destinationToken?.isNativeCurrency)
    ) {
      return true;
    }
    return false;
  });
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
