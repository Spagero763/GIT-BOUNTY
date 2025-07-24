'use client';

import { useWallet } from '@/hooks/use-wallet';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

export default function ConnectWalletButton() {
  const { connectWallet, disconnectWallet, address } = useWallet();

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  if (address) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono bg-white/10 px-3 py-1.5 rounded-md">{truncateAddress(address)}</span>
        <Button variant="outline" onClick={disconnectWallet}>Disconnect</Button>
      </div>
    );
  }

  return (
    <Button onClick={connectWallet}>
      <Wallet className="mr-2" /> Connect Wallet
    </Button>
  );
}
