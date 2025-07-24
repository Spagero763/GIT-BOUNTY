import React, { useState, useMemo } from 'react';
import type { Bounty, Profile } from '@/lib/types';
import BountyCard from './bounty-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { useWallet } from '@/hooks/use-wallet';
import { markBountyAsCompleted } from '@/app/actions';

interface MyBountiesTabProps {
  allBounties: Bounty[];
  profile: Profile;
  updateBounty: (bounty: Bounty) => void;
}

export default function MyBountiesTab({ allBounties, profile, updateBounty }: MyBountiesTabProps) {
  const { toast } = useToast();
  const { address } = useWallet();
  const [completingBountyId, setCompletingBountyId] = useState<string | null>(null);

  const myCreatedBounties = useMemo(() => {
    if (!address) return [];
    return allBounties.filter(b => b.creatorAddress && b.creatorAddress.toLowerCase() === address.toLowerCase());
  }, [allBounties, address]);

  const myAssignedBounties = useMemo(() => {
    if (!address) return [];
    return allBounties.filter(b => b.solverAddress && b.solverAddress.toLowerCase() === address.toLowerCase() && b.creatorAddress.toLowerCase() !== address.toLowerCase());
  }, [allBounties, address]);

  const handleComplete = async (bounty: Bounty) => {
    setCompletingBountyId(bounty.id);
    toast({
      title: "Completing Bounty...",
      description: "Processing completion on the server. Please wait.",
    });

    try {
      const result = await markBountyAsCompleted(bounty);

      if (result.success) {
        updateBounty({ ...bounty, status: 'Completed' });
        toast({
            title: "Bounty Completed!",
            description: `${bounty.title} has been marked as completed.`,
        });
      } else {
        throw new Error(result.error || "Failed to complete bounty.");
      }

    } catch (err: any) {
        console.error("Complete Bounty Error:", err);
        toast({
            variant: "destructive",
            title: "Completion Failed",
            description: err.message,
        });
    } finally {
        setCompletingBountyId(null);
    }
  };

  const renderBountyList = (bounties: Bounty[], emptyMessage: string) => {
    if (bounties.length === 0) {
      return (
         <div className="text-center py-16 text-gray-400 bg-white/5 rounded-lg border border-dashed border-white/10">
          <h3 className="text-xl font-semibold">{emptyMessage}</h3>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bounties.map((bounty) => (
          <BountyCard 
            key={bounty.id} 
            bounty={bounty}
            onComplete={handleComplete}
            isMyBountyView={true}
            isCompleting={completingBountyId === bounty.id}
          />
        ))}
      </div>
    );
  }
  
  if (!address) {
    return (
       <div className="text-center py-16 text-gray-400 bg-white/5 rounded-lg border border-dashed border-white/10">
        <h3 className="text-xl font-semibold">Connect Wallet</h3>
        <p>Please connect your wallet to view your bounties.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="created" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10">
        <TabsTrigger value="created">Created by Me</TabsTrigger>
        <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
      </TabsList>
      <TabsContent value="created" className="mt-6">
        {renderBountyList(myCreatedBounties, "You haven't created any bounties yet.")}
      </TabsContent>
      <TabsContent value="assigned" className="mt-6">
        {renderBountyList(myAssignedBounties, "No bounties have been assigned to you yet.")}
      </TabsContent>
    </Tabs>
  );
}
