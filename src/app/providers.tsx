"use client";

import { config } from "@/config/wagmi.config";
import { JotaiProvider } from "@/lib/JotaiProvider";
import { UIProvider } from "@/lib/UIProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <UIProvider>{children}</UIProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
