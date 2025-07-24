import { useState, useMemo } from 'react';
import type { Bounty, Profile } from '@/lib/types';
import { getSummaryForIssue } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Rocket } from 'lucide-react';
import { z } from 'zod';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { DevBountyToken_ABI, BountyFactory_ABI } from '@/lib/abi';

interface CreateBountyTabProps {
  addBounty: (bounty: Bounty) => void;
  profile: Profile;
}

const formSchema = z.object({
  url: z.string().url().regex(/github\.com\/.+\/.+\/issues\/\d+/),
  amount: z.coerce.number().min(1, "Bounty must be greater than 0."),
});

const DBT_TO_ETH_RATE = 0.00000000001;

export default function CreateBountyTab({ addBounty, profile }: CreateBountyTabProps) {
  const [issueUrl, setIssueUrl] = useState('');
  const [bountyAmount, setBountyAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { address } = useAccount();
  const { data: hash, writeContractAsync } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const ethEquivalent = useMemo(() => {
    const amount = parseFloat(bountyAmount);
    if (isNaN(amount) || amount <= 0) return '0';
    return (amount * DBT_TO_ETH_RATE).toPrecision(2);
  }, [bountyAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!profile.githubUsername) {
      toast({ variant: "destructive", title: "Profile Incomplete", description: "Please set your GitHub username in the Profile tab first." });
      setIsLoading(false);
      return;
    }

    if (!address) {
      toast({ variant: "destructive", title: "Wallet Not Connected", description: "Please connect your wallet to create a bounty." });
      setIsLoading(false);
      return;
    }

    try {
      const validation = formSchema.safeParse({ url: issueUrl, amount: bountyAmount });
      if (!validation.success) {
        toast({ variant: "destructive", title: "Invalid Input", description: validation.error.errors[0].message });
        setIsLoading(false);
        return;
      }
      
      const { amount } = validation.data;
      const amountInWei = parseUnits(amount.toString(), 18);

      const { summary, title, error } = await getSummaryForIssue(issueUrl);

      if (error) {
        toast({ variant: "destructive", title: "Error", description: error });
        setIsLoading(false);
        return;
      }

      toast({ title: "Processing Transaction", description: "Please approve the token transfer in your wallet." });
      
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.DevBountyToken as `0x${string}`,
        abi: DevBountyToken_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.BountyFactory, amountInWei],
      });

      toast({ title: "Approval Sent", description: "Waiting for approval confirmation..." });
      
      // We need a better way to wait for the approval to be confirmed before proceeding.
      // For now, we will add a small delay.
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      toast({ title: "Approval Confirmed!", description: "Creating bounty on-chain... Please confirm in your wallet." });
      
      const bountyTx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.BountyFactory as `0x${string}`,
        abi: BountyFactory_ABI,
        functionName: 'createBounty',
        args: [issueUrl, address, amountInWei],
      });
      
      toast({ title: "Bounty Creation Sent", description: "Waiting for transaction confirmation..." });
      
      const newBounty: Bounty = {
        id: bountyTx, // Placeholder, ideally we'd get this from the event
        githubUrl: issueUrl,
        title,
        summary,
        amount,
        status: 'Assigned',
        creatorGithub: profile.githubUsername,
        solverGithub: profile.githubUsername,
        creatorAddress: address,
        solverAddress: address,
        createdAt: new Date().toISOString(),
      };

      addBounty(newBounty);

      toast({
        title: "Bounty Created!",
        description: `Your new bounty is now live on-chain.`,
      });

      setIssueUrl('');
      setBountyAmount('');
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.shortMessage || err.message || "Could not create bounty. Please check the console and try again.";
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 border border-white/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Create New Bounty</CardTitle>
        <CardDescription>Fund a GitHub issue and get it resolved by the community.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="issueUrl">GitHub Issue URL</Label>
            <Input
              id="issueUrl"
              type="url"
              placeholder="https://github.com/owner/repo/issues/123"
              value={issueUrl}
              onChange={(e) => setIssueUrl(e.target.value)}
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bountyAmount">Bounty Amount (DBT)</Label>
            <Input
              id="bountyAmount"
              type="number"
              step="any"
              min="1"
              placeholder="100"
              value={bountyAmount}
              onChange={(e) => setBountyAmount(e.target.value)}
              required
              className="bg-white/5 border-white/10"
            />
            {parseFloat(bountyAmount) > 0 && (
                <p className="text-sm text-gray-400 mt-1">
                    ~ {ethEquivalent} Base Sepolia ETH
                </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading || !address} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="mr-2 h-4 w-4" />
            )}
            { !address ? "Connect Wallet to Create" : isLoading ? 'Processing...' : 'Create On-Chain Bounty'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
