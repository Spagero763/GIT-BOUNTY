import React, { useState, useMemo } from 'react';
import type { Bounty, Profile } from '@/lib/types';
import BountyCard from './bounty-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { markBountyAsCompleted } from '@/app/actions';

interface BrowseBountiesTabProps {
  bounties: Bounty[];
  profile: Profile;
  updateBounty: (bounty: Bounty) => void;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export default function BrowseBountiesTab({ bounties, profile, updateBounty }: BrowseBountiesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [completingBountyId, setCompletingBountyId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleComplete = async (bounty: Bounty) => {
    setCompletingBountyId(bounty.id);
     toast({
      title: "Completing Bounty...",
      description: "Processing on-chain transaction. Please wait.",
    });

    const result = await markBountyAsCompleted(bounty.id);

    if (result.success) {
      updateBounty({ ...bounty, status: 'Completed' });
      toast({
        title: "Bounty Completed!",
        description: `${bounty.title} has been marked as completed.`,
      });
    } else {
        toast({
            variant: "destructive",
            title: "Completion Failed",
            description: result.error,
        });
    }
    setCompletingBountyId(null);
  };


  const filteredAndSortedBounties = useMemo(() => {
    return bounties
      .filter(bounty => 
        (bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
         bounty.summary.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        switch (sortOption) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'highest':
            return b.amount - a.amount;
          case 'lowest':
            return a.amount - b.amount;
          default:
            return 0;
        }
      });
  }, [bounties, searchTerm, sortOption]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Filter by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>
        <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
          <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest Bounty</SelectItem>
            <SelectItem value="lowest">Lowest Bounty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedBounties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedBounties.map((bounty) => (
            <BountyCard 
                key={bounty.id} 
                bounty={bounty} 
                onComplete={handleComplete}
                isCompleting={completingBountyId === bounty.id}
             />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 bg-white/5 rounded-lg border border-dashed border-white/10">
          <h3 className="text-xl font-semibold">No bounties found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
}
