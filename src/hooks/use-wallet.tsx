'use client';

import React from 'react';
import { WagmiProvider as WagmiProviderBase, createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = '3b8b39b56adddec8357a5528255d6a2f'; // Replace with your WalletConnect Project ID

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProviderBase config={config}>
      {children}
    </WagmiProviderBase>
  );
}
