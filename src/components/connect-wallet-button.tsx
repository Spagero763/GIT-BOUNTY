'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  if (!isClient) {
    // Render a placeholder on the server and during initial client render
    return <Button><Wallet className="mr-2" /> Connect Wallet</Button>;
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono bg-white/10 px-3 py-1.5 rounded-md">{truncateAddress(address)}</span>
        <Button variant="outline" onClick={() => disconnect()}>Disconnect</Button>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Wallet className="mr-2" /> Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose your wallet</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              variant="outline"
              className="w-full justify-start py-6 text-lg"
            >
              <img src={connector.icon} alt={connector.name} className="w-6 h-6 mr-4" />
              {connector.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
