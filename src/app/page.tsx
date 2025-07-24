'use client';

import React from 'react';
import type { Bounty, Profile } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { WagmiProvider } from '@/hooks/use-wallet';

import AppHeader from '@/components/app-header';
import ProfileTab from '@/components/profile-tab';
import BrowseBountiesTab from '@/components/browse-bounties-tab';
import CreateBountyTab from '@/components/create-bounty-tab';
import MyBountiesTab from '@/components/my-bounties-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Search, PlusCircle, List } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  const [bounties, setBounties] = useLocalStorage<Bounty[]>('bounties', []);
  const [profile, setProfile] = useLocalStorage<Profile>('profile', { githubUsername: '' });

  const addBounty = (bounty: Bounty) => {
    setBounties(prev => [...prev, bounty]);
  };

  const updateBounty = (updatedBounty: Bounty) => {
    setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b));
  };
  
  return (
    <WagmiProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1a1a3e] text-gray-100">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <AppHeader />

            <Tabs defaultValue="browse" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/5 backdrop-blur-sm border border-white/10 h-auto">
                <TabsTrigger value="profile" className="py-2.5"><User className="mr-2" />Profile</TabsTrigger>
                <TabsTrigger value="browse" className="py-2.5"><Search className="mr-2" />Browse</TabsTrigger>
                <TabsTrigger value="create" className="py-2.5"><PlusCircle className="mr-2" />Create</TabsTrigger>
                <TabsTrigger value="my-bounties" className="py-2.5"><List className="mr-2" />My Bounties</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <ProfileTab profile={profile} setProfile={setProfile} />
              </TabsContent>
              <TabsContent value="browse" className="mt-6">
                <BrowseBountiesTab bounties={bounties} profile={profile} updateBounty={updateBounty} />
              </TabsContent>
              <TabsContent value="create" className="mt-6">
                <CreateBountyTab addBounty={addBounty} profile={profile} />
              </TabsContent>
              <TabsContent value="my-bounties" className="mt-6">
                <MyBountiesTab allBounties={bounties} profile={profile} updateBounty={updateBounty} />
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
