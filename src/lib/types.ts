export type BountyStatus = 'Open' | 'Assigned' | 'Completed';

export interface Bounty {
  id: string; // Will now be the transaction hash or a generated client-side ID
  githubUrl: string;
  title: string;
  summary: string;
  amount: number;
  status: BountyStatus;
  creatorGithub: string; // Username of creator
  solverGithub?: string; // Username of solver
  creatorAddress: string; // Wallet address of creator
  solverAddress?: string; // Wallet address of solver
  createdAt: string;
}

export interface Profile {
  githubUsername: string;
}
