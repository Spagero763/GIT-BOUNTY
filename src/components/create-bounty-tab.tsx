import { useState } from 'react';
import type { Bounty, Profile } from '@/lib/types';
import { getSummaryForIssue } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Rocket } from 'lucide-react';
import { z } from 'zod';

interface CreateBountyTabProps {
  addBounty: (bounty: Bounty) => void;
  profile: Profile;
}

const formSchema = z.object({
  url: z.string().url().regex(/github\.com\/.+\/.+\/issues\/\d+/),
  amount: z.coerce.number().min(0.001, "Bounty must be at least 0.001 ETH."),
});

export default function CreateBountyTab({ addBounty, profile }: CreateBountyTabProps) {
  const [issueUrl, setIssueUrl] = useState('');
  const [bountyAmount, setBountyAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!profile.githubUsername) {
      toast({
        variant: "destructive",
        title: "Profile Incomplete",
        description: "Please set your GitHub username in the Profile tab first.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const validation = formSchema.safeParse({ url: issueUrl, amount: bountyAmount });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Invalid Input",
          description: validation.error.errors[0].message,
        });
        setIsLoading(false);
        return;
      }
      
      const { amount } = validation.data;
      
      const { summary, title, error } = await getSummaryForIssue(issueUrl);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
        setIsLoading(false);
        return;
      }

      const newBounty: Bounty = {
        id: crypto.randomUUID(),
        githubUrl: issueUrl,
        title,
        summary,
        amount,
        status: 'Open',
        creatorGithub: profile.githubUsername,
        createdAt: new Date().toISOString(),
      };

      addBounty(newBounty);

      toast({
        title: "Bounty Created!",
        description: "Your new bounty is now live.",
      });

      setIssueUrl('');
      setBountyAmount('');
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Could not create bounty. Please try again.",
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
            <Label htmlFor="bountyAmount">Bounty Amount (ETH)</Label>
            <Input
              id="bountyAmount"
              type="number"
              step="0.001"
              min="0.01"
              placeholder="0.1"
              value={bountyAmount}
              onChange={(e) => setBountyAmount(e.target.value)}
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Creating...' : 'Create Bounty'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
