import React, { useState, useMemo } from 'react';
import type { Bounty, Profile } from '@/lib/types';
import BountyCard from './bounty-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { useWallet } from '@/hooks/use-wallet';

interface MyBountiesTabProps {
  allBounties: Bounty[];
  profile: Profile;
  updateBounty: (bounty: Bounty) => void;
}

export default function MyBountiesTab({ allBounties, profile, updateBounty }: MyBountiesTabProps) {
  const { toast } = useToast();
  const { address, contracts } = useWallet();
  const [completingBountyId, setCompletingBountyId] = useState<string | null>(null);


  const myCreatedBounties = useMemo(() => {
    return allBounties.filter(b => b.creatorAddress && b.creatorAddress.toLowerCase() === address?.toLowerCase());
  }, [allBounties, address]);

  const myAssignedBounties = useMemo(() => {
    return allBounties.filter(b => b.solverAddress && b.solverAddress.toLowerCase() === address?.toLowerCase() && b.creatorAddress.toLowerCase() !== address?.toLowerCase());
  }, [allBounties, address]);

  const handleComplete = async (bounty: Bounty) => {
    if (!contracts) {
        toast({
            variant: "destructive",
            title: "Wallet Not Connected",
            description: "Please connect your wallet to complete a bounty.",
        });
        return;
    }

    setCompletingBountyId(bounty.id);
    toast({
      title: "Completing Bounty...",
      description: "Please approve the transaction in your wallet.",
    });

    try {
        const tx = await contracts.bountyFactory.completeBounty(bounty.id);
        await tx.wait();

        updateBounty({ ...bounty, status: 'Completed' });
        toast({
            title: "Bounty Completed!",
            description: `${bounty.title} has been marked as completed.`,
        });

    } catch (err: any) {
        console.error("Complete Bounty Error:", err);
        toast({
            variant: "destructive",
            title: "Completion Failed",
            description: err.reason || "Failed to complete bounty. Check console logs.",
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
  
  if (!profile.githubUsername || !address) {
    return (
       <div className="text-center py-16 text-gray-400 bg-white/5 rounded-lg border border-dashed border-white/10">
        <h3 className="text-xl font-semibold">Connect Wallet & Set Profile</h3>
        <p>Please connect your wallet and set your GitHub username in the Profile tab to view your bounties.</p>
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
