import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";

export const useWalletConnect = () => {
  const { address, isConnected, chain, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();
  const { switchChain, switchChainAsync } = useSwitchChain();
  return {
    address,
    isConnected,
    chain,
    chainId,
    disconnect,
    connect,
    connectors,
    switchChain,
    switchChainAsync,
  };
};
