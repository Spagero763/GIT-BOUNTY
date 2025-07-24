// Summarizes a Github issue using a generative AI model.
'use server';
/**
 * @fileOverview Summarizes a Github issue using a generative AI model.
 *
 * - summarizeGithubIssue - A function that summarizes a Github issue.
 * - SummarizeGithubIssueInput - The input type for the summarizeGithubIssue function.
 * - SummarizeGithubIssueOutput - The return type for the summarizeGithubIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeGithubIssueInputSchema = z.object({
  issueUrl: z
    .string()
    .describe("The URL of the Github issue to summarize."),
});
export type SummarizeGithubIssueInput = z.infer<typeof SummarizeGithubIssueInputSchema>;

const SummarizeGithubIssueOutputSchema = z.object({
  summary: z.string().describe('A summary of the Github issue.'),
});
export type SummarizeGithubIssueOutput = z.infer<typeof SummarizeGithubIssueOutputSchema>;

export async function summarizeGithubIssue(input: SummarizeGithubIssueInput): Promise<SummarizeGithubIssueOutput> {
  return summarizeGithubIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeGithubIssuePrompt',
  input: {schema: SummarizeGithubIssueInputSchema},
  output: {schema: SummarizeGithubIssueOutputSchema},
  prompt: `Summarize the following Github issue.  Provide a detailed summary of the issue to help a developer decide if they want to work on the bounty.\n\nURL: {{{issueUrl}}}`,
});

const summarizeGithubIssueFlow = ai.defineFlow(
  {
    name: 'summarizeGithubIssueFlow',
    inputSchema: SummarizeGithubIssueInputSchema,
    outputSchema: SummarizeGithubIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
