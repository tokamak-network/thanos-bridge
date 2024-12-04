import { config } from "@/config/wagmi.config";
import { TokenBalance } from "@/types/token";
import { getBalance } from "@wagmi/core";
import { parseUnits } from "viem";
import { getTokenInfoByAddress } from "./token";

export const getParsedAmount = (amount: string, decimals: number) => {
  return parseUnits(amount, decimals);
};

export const getTokenBalance = async (
  address: `0x${string}`,
  token?: `0x${string}`
): Promise<TokenBalance> => {
  const balance = await getBalance(config, {
    address,
    token,
  });
  return balance;
};

export const getTokenBalanceByChainId = async (
  address: `0x${string}`,
  chainId: number,
  token?: `0x${string}`
): Promise<TokenBalance | null> => {
  const tokenInfo = getTokenInfoByAddress(chainId, token);
  if (!tokenInfo) return null;
  const balance = await getTokenBalance(address, tokenInfo.address);
  return balance;
};

export const trimTokenBalance = (balance: string, decimals: number) => {
  const [whole, decimal] = balance.split(".");
  if (!decimal) return balance;
  return `${whole}.${decimal.slice(0, decimals)}`;
};
