'use server';

import { summarizeGithubIssue } from '@/ai/flows/summarize-github-issue';
import { z } from 'zod';
import { ethers } from 'ethers';
import { BountyFactory_ABI } from '@/lib/abi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import type { Bounty } from '@/lib/types';


const GithubUrlSchema = z.string().url().regex(/github\.com\/.+\/.+\/issues\/\d+/, "Invalid GitHub Issue URL");

function extractIssueTitleFromUrl(url: string): string {
    try {
        const path = new URL(url).pathname;
        const parts = path.split('/');
        const owner = parts[1] || 'owner';
        const repo = parts[2] || 'repo';
        const issueNumber = parts[4] || '0';
        return `${owner}/${repo} #${issueNumber}`;
    } catch (error) {
        return "Unknown Issue";
    }
}

export async function getSummaryForIssue(issueUrl: string): Promise<{ summary: string, title: string, error?: string }> {
  try {
    const validatedUrl = GithubUrlSchema.parse(issueUrl);
    const result = await summarizeGithubIssue({ issueUrl: validatedUrl });
    const title = extractIssueTitleFromUrl(validatedUrl);

    if (result.summary) {
      return { summary: result.summary, title };
    }
    return { summary: '', title: '', error: "Failed to generate summary." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { summary: '', title: '', error: error.errors[0].message };
    }
    console.error(error);
    return { summary: '', title: '', error: 'An unexpected error occurred.' };
  }
}

export async function markBountyAsCompleted(bounty: Bounty): Promise<{ success: boolean; error?: string }> {
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.RPC_URL;

  if (!privateKey || !rpcUrl) {
    const errorMsg = 'Server-side wallet not configured. Please set PRIVATE_KEY and RPC_URL environment variables.';
    console.error(errorMsg);
    return { success: false, error: errorMsg };
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const bountyFactory = new ethers.Contract(CONTRACT_ADDRESSES.BountyFactory, BountyFactory_ABI, wallet);

    // The contract's completeBounty function needs to be called by the contract owner.
    const tx = await bountyFactory.completeBounty(bounty.id);
    await tx.wait();
    
    return { success: true };
  } catch (err: any) {
    console.error("Failed to complete bounty:", err);
    const errorMessage = err.reason || "An unknown error occurred during completion.";
    return { success: false, error: errorMessage };
  }
}
