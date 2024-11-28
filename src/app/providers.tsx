"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/config/wagmi.config";
import { UIProvider } from "@/lib/UIProvider";
import { JotaiProvider } from "@/lib/JotaiProvider";

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
