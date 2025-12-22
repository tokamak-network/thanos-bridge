interface EthereumProvider {
  request<T = unknown>(args: {
    method: string;
    params?: unknown[];
  }): Promise<T>;
  isMetaMask?: boolean;
  on?: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    callback: (...args: unknown[]) => void
  ) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};
