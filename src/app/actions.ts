'use server';

import { summarizeGithubIssue } from '@/ai/flows/summarize-github-issue';
import { z } from 'zod';

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
