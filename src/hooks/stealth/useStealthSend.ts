import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import {
  generateStealthAddress, parseStealthMetaAddress, lookupStealthMetaAddress,
  CANONICAL_ADDRESSES, SCHEME_ID, type GeneratedStealthAddress,
} from '@/lib/stealth';

const ANNOUNCER_ABI = [
  'function announce(uint256 schemeId, address stealthAddress, bytes calldata ephemeralPubKey, bytes calldata metadata) external',
];

function getProvider() {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  return new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
}

export function useStealthSend() {
  const { isConnected } = useAccount();
  const [lastGeneratedAddress, setLastGeneratedAddress] = useState<GeneratedStealthAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAddressFor = useCallback((metaAddress: string): GeneratedStealthAddress | null => {
    setError(null);
    try {
      const parsed = parseStealthMetaAddress(metaAddress);
      const generated = generateStealthAddress(parsed);
      setLastGeneratedAddress(generated);
      return generated;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate address');
      return null;
    }
  }, []);

  const generateAddressForAddress = useCallback(async (recipientAddress: string): Promise<GeneratedStealthAddress | null> => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = getProvider();
      if (!provider) throw new Error('No wallet provider');

      const metaBytes = await lookupStealthMetaAddress(provider, recipientAddress);
      if (!metaBytes) throw new Error('Recipient has no registered stealth address');

      const uri = `st:thanos:0x${metaBytes.replace(/^0x/, '')}`;
      const parsed = parseStealthMetaAddress(uri);
      const generated = generateStealthAddress(parsed);
      setLastGeneratedAddress(generated);
      return generated;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate address');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const announce = useCallback(async (signer: ethers.Signer, addr: GeneratedStealthAddress) => {
    const announcer = new ethers.Contract(CANONICAL_ADDRESSES.announcer, ANNOUNCER_ABI, signer);
    const ephPubKey = '0x' + addr.ephemeralPublicKey.replace(/^0x/, '');
    const metadata = '0x' + addr.viewTag;
    const tx = await announcer.announce(SCHEME_ID.SECP256K1, addr.stealthAddress, ephPubKey, metadata);
    await tx.wait();
  }, []);

  const sendEthToStealth = useCallback(async (metaAddress: string, amount: string): Promise<string | null> => {
    if (!isConnected) { setError('Wallet not connected'); return null; }
    setError(null);
    setIsLoading(true);

    try {
      const generated = generateAddressFor(metaAddress);
      if (!generated) throw new Error('Failed to generate stealth address');

      const provider = getProvider();
      if (!provider) throw new Error('No wallet provider');
      const signer = provider.getSigner();

      const tx = await signer.sendTransaction({
        to: generated.stealthAddress,
        value: ethers.utils.parseEther(amount),
      });
      const receipt = await tx.wait();

      await announce(signer, generated);
      return receipt.transactionHash;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, generateAddressFor, announce]);

  const sendTokenToStealth = useCallback(async (metaAddress: string, tokenAddress: string, amount: string): Promise<string | null> => {
    if (!isConnected) { setError('Wallet not connected'); return null; }
    setError(null);
    setIsLoading(true);

    try {
      const generated = generateAddressFor(metaAddress);
      if (!generated) throw new Error('Failed to generate stealth address');

      const provider = getProvider();
      if (!provider) throw new Error('No wallet provider');
      const signer = provider.getSigner();

      const erc20 = new ethers.Contract(tokenAddress, [
        'function transfer(address to, uint256 amount) returns (bool)',
        'function decimals() view returns (uint8)',
      ], signer);

      const decimals = await erc20.decimals();
      const amountWei = ethers.utils.parseUnits(amount, decimals);
      const tx = await erc20.transfer(generated.stealthAddress, amountWei);
      const receipt = await tx.wait();

      await announce(signer, generated);
      return receipt.transactionHash;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send token');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, generateAddressFor, announce]);

  const announcePayment = useCallback(async (stealthAddress: string, ephemeralPublicKey: string, viewTag: string): Promise<string | null> => {
    if (!isConnected) { setError('Wallet not connected'); return null; }
    setError(null);
    setIsLoading(true);

    try {
      const provider = getProvider();
      if (!provider) throw new Error('No wallet provider');
      const signer = provider.getSigner();

      const announcer = new ethers.Contract(CANONICAL_ADDRESSES.announcer, ANNOUNCER_ABI, signer);
      const tx = await announcer.announce(SCHEME_ID.SECP256K1, stealthAddress, '0x' + ephemeralPublicKey.replace(/^0x/, ''), '0x' + viewTag);
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to announce');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  return { generateAddressFor, generateAddressForAddress, sendEthToStealth, sendTokenToStealth, announcePayment, lastGeneratedAddress, isLoading, error };
}
