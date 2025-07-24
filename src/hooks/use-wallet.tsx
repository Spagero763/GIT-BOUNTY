'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { BountyFactory_ABI, DevBountyToken_ABI, EscrowPayments_ABI, ReputationTracker_ABI } from '@/lib/abi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import type { Contracts } from '@/lib/types';

interface WalletContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: ethers.BrowserProvider | null;
  contracts: Contracts | null;
  signer: ethers.JsonRpcSigner | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contracts, setContracts] = useState<Contracts | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const userAddress = await signer.getAddress();
        
        setProvider(browserProvider);
        setSigner(signer);
        setAddress(userAddress);
        localStorage.setItem('walletAddress', userAddress);

        const bountyFactory = new ethers.Contract(CONTRACT_ADDRESSES.BountyFactory, BountyFactory_ABI, signer);
        const devBountyToken = new ethers.Contract(CONTRACT_ADDRESSES.DevBountyToken, DevBountyToken_ABI, signer);
        const escrowPayments = new ethers.Contract(CONTRACT_ADDRESSES.EscrowPayments, EscrowPayments_ABI, signer);
        const reputationTracker = new ethers.Contract(CONTRACT_ADDRESSES.ReputationTracker, ReputationTracker_ABI, signer);

        setContracts({ bountyFactory, devBountyToken, escrowPayments, reputationTracker });

      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setContracts(null);
    localStorage.removeItem('walletAddress');
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      const storedAddress = localStorage.getItem('walletAddress');
      if (storedAddress && typeof window.ethereum !== 'undefined') {
          connectWallet();
      }
    };
    checkConnection();
  }, [connectWallet]);
  
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          disconnectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [connectWallet, disconnectWallet]);


  return (
    <WalletContext.Provider value={{ address, connectWallet, disconnectWallet, provider, contracts, signer }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
