'use server';

import { summarizeGithubIssue } from '@/ai/flows/summarize-github-issue';
import { z } from 'zod';
import { ethers } from 'ethers';
import { BountyFactory_ABI } from '@/lib/abi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';

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

// NOTE: This is a placeholder as the contract doesn't support assigning a bounty after creation.
// We are calling 'submitSolution' as a stand-in for a real assignment function.
// A more robust solution would involve modifying the smart contract.
export async function assignBountyToSolver(bountyId: string): Promise<{ success: boolean, error?: string }> {
    try {
        if (!process.env.PRIVATE_KEY) {
            throw new Error("PRIVATE_KEY is not set in the server environment.");
        }
        if (!process.env.RPC_URL) {
            throw new Error("RPC_URL is not set in the server environment.");
        }
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESSES.BountyFactory, BountyFactory_ABI, wallet);
        
        // This is a placeholder interaction. 
        // In a real scenario, you'd have a proper assign function in your contract.
        // For now, we simulate this by calling submitSolution.
        const tx = await contract.submitSolution(bountyId);
        await tx.wait();

        return { success: true };
    } catch (err: any) {
        console.error("Assign Bounty Error:", err);
        return { success: false, error: err.reason || "Failed to assign bounty. Check server logs." };
    }
}


export async function markBountyAsCompleted(bountyId: string): Promise<{ success: boolean, error?: string }> {
    try {
        if (!process.env.PRIVATE_KEY) {
            throw new Error("PRIVATE_KEY is not set in the server environment.");
        }
        if (!process.env.RPC_URL) {
            throw new Error("RPC_URL is not set in the server environment.");
        }
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESSES.BountyFactory, BountyFactory_ABI, wallet);
        
        const tx = await contract.completeBounty(bountyId);
        await tx.wait();

        return { success: true };
    } catch (err: any) {
        console.error("Complete Bounty Error:", err);
        return { success: false, error: err.reason || "Failed to complete bounty. Check server logs." };
    }
}
