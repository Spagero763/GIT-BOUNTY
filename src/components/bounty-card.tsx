import type { Bounty, BountyStatus, Profile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, CircleDollarSign, User, Calendar, Check, Briefcase, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useWallet } from '@/hooks/use-wallet';

interface BountyCardProps {
  bounty: Bounty;
  onComplete: (bounty: Bounty) => void;
  isMyBountyView?: boolean;
  isCompleting?: boolean;
}

const statusConfig: { [key in BountyStatus]: { color: 'green' | 'yellow' | 'blue', text: string } } = {
  Open: { color: 'green', text: 'Open' },
  Assigned: { color: 'yellow', text: 'Assigned' },
  Completed: { color: 'blue', text: 'Completed' },
};

const DBT_TO_ETH_RATE = 0.00000000001; // 0.000000001 ETH / 100 DBT

export default function BountyCard({ bounty, onComplete, isMyBountyView = false, isCompleting = false }: BountyCardProps) {
  const { address } = useWallet();
  const { color, text } = statusConfig[bounty.status];
  
  const canComplete = bounty.status === 'Assigned' && address && address.toLowerCase() === bounty.creatorAddress.toLowerCase();
  
  const ethEquivalent = (bounty.amount * DBT_TO_ETH_RATE).toPrecision(2);

  return (
    <Card className="bg-white/5 border border-white/10 text-gray-200 flex flex-col h-full transform transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <CardTitle className="font-headline text-lg text-primary leading-tight">{bounty.title}</CardTitle>
            <Badge variant="outline" className={`border-${color}-500 text-${color}-400 bg-${color}-500/10 shrink-0`}>
                {text}
            </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-2">
            <Github className="w-4 h-4" />
            <a href={bounty.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary truncate">
                {bounty.githubUrl.replace('https://github.com/', '')}
            </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-300 line-clamp-4 text-sm">{bounty.summary}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-accent"/>
                <span className="font-semibold">{bounty.amount} DBT (~{ethEquivalent} ETH)</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400"/>
                <span>{formatDistanceToNow(new Date(bounty.createdAt), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400"/>
                <span>Created by {bounty.creatorGithub}</span>
            </div>
            {bounty.solverGithub && (
                <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400"/>
                    <span>Assigned to {bounty.solverGithub}</span>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        {isMyBountyView && canComplete && (
            <Button variant="outline" className="w-full" onClick={() => onComplete(bounty)} disabled={isCompleting}>
                {isCompleting ? <Loader2 className="mr-2 animate-spin" /> : <Check className="mr-2" />}
                {isCompleting ? "Completing..." : "Mark as Completed"}
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
