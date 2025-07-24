import type { Bounty, BountyStatus, Profile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, CircleDollarSign, User, Calendar, Check, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BountyCardProps {
  bounty: Bounty;
  profile: Profile;
  onAssign: (bounty: Bounty) => void;
  onComplete: (bounty: Bounty) => void;
  isMyBountyView?: boolean;
}

const statusConfig: { [key in BountyStatus]: { color: 'green' | 'yellow' | 'blue', text: string } } = {
  Open: { color: 'green', text: 'Open' },
  Assigned: { color: 'yellow', text: 'Assigned' },
  Completed: { color: 'blue', text: 'Completed' },
};

export default function BountyCard({ bounty, profile, onAssign, onComplete, isMyBountyView = false }: BountyCardProps) {
  const { color, text } = statusConfig[bounty.status];
  
  const canAssign = bounty.status === 'Open' && profile.githubUsername && profile.githubUsername !== bounty.creatorGithub;
  const canComplete = bounty.status === 'Assigned' && profile.githubUsername === bounty.creatorGithub;

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
                <span className="font-semibold">{bounty.amount} ETH</span>
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
            <Button variant="outline" className="w-full" onClick={() => onComplete(bounty)}>
                <Check className="mr-2" /> Mark as Completed
            </Button>
        )}
        {!isMyBountyView && canAssign && (
            <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => onAssign(bounty)}>
                <Briefcase className="mr-2" /> Take on Bounty
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
