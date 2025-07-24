export type BountyStatus = 'Open' | 'Assigned' | 'Completed';

export interface Bounty {
  id: string;
  githubUrl: string;
  title: string;
  summary: string;
  amount: number;
  status: BountyStatus;
  creatorGithub: string;
  solverGithub?: string;
  createdAt: string;
}

export interface Profile {
  githubUsername: string;
}
