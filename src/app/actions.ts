'use server';

import { summarizeGithubIssue } from '@/ai/flows/summarize-github-issue';
import { z } from 'zod';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
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
  const privateKey = process.env.PRIVATE_KEY as `0x${string}` | undefined;
  // Using a public, hardcoded RPC URL for Base Sepolia testnet to simplify deployment.
  const rpcUrl = "https://sepolia.base.org";

  if (!privateKey) {
    const errorMsg = 'Server-side wallet not configured. Please set the PRIVATE_KEY environment variable.';
    console.error(errorMsg);
    return { success: false, error: errorMsg };
  }

  try {
    const account = privateKeyToAccount(privateKey);
    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(rpcUrl),
    }).extend(publicActions);

    const { request } = await client.simulateContract({
      address: CONTRACT_ADDRESSES.BountyFactory as `0x${string}`,
      abi: BountyFactory_ABI,
      functionName: 'completeBounty',
      args: [BigInt(bounty.id)],
      account,
    });
    
    await client.writeContract(request);

    return { success: true };
  } catch (err: any) {
    console.error("Failed to complete bounty:", err);
    const errorMessage = err.shortMessage || err.message || "An unknown error occurred during completion.";
    return { success: false, error: errorMessage };
  }
}
