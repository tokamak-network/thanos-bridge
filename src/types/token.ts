export interface Token {
  chainId: number;
  isNativeCurrency: boolean;
  address?: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  bridgedTokenSymbol?: string;
}

export interface TokenBalance {
  decimals: number;
  formatted: string;
  value: bigint;
  symbol: string;
}
