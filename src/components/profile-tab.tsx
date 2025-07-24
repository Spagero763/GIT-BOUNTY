import React, { useState } from 'react';
import type { Profile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Github, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ProfileTabProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

export default function ProfileTab({ profile, setProfile }: ProfileTabProps) {
  const [username, setUsername] = useState(profile.githubUsername);
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setProfile({ githubUsername: username.trim() });
      toast({
        title: "Profile Saved",
        description: `Your GitHub username has been set to ${username.trim()}`,
      });
    } else {
        toast({
            variant: "destructive",
            title: "Invalid Username",
            description: "GitHub username cannot be empty.",
        });
    }
  };

  return (
    <Card className="bg-white/5 border border-white/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Developer Profile</CardTitle>
        <CardDescription>Your GitHub username is used to create and track bounties.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="githubUsername">GitHub Username</Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="githubUsername"
                type="text"
                placeholder="your-github-handle"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
