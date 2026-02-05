'use server';

/**
 * @fileOverview A flow that summarizes the content of a blog article.
 *
 * - summarizeArticleContent - A function that summarizes the article content.
 * - SummarizeArticleContentInput - The input type for the summarizeArticleContent function.
 * - SummarizeArticleContentOutput - The return type for the summarizeArticleContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArticleContentInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The full content of the article to be summarized.'),
});

export type SummarizeArticleContentInput = z.infer<
  typeof SummarizeArticleContentInputSchema
>;

const SummarizeArticleContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the article content.'),
});

export type SummarizeArticleContentOutput = z.infer<
  typeof SummarizeArticleContentOutputSchema
>;

export async function summarizeArticleContent(
  input: SummarizeArticleContentInput
): Promise<SummarizeArticleContentOutput> {
  return summarizeArticleContentFlow(input);
}

const summarizeArticleContentPrompt = ai.definePrompt({
  name: 'summarizeArticleContentPrompt',
  input: {schema: SummarizeArticleContentInputSchema},
  output: {schema: SummarizeArticleContentOutputSchema},
  prompt: `Summarize the following article content in a concise manner:\n\n{{{articleContent}}}`,
});

const summarizeArticleContentFlow = ai.defineFlow(
  {
    name: 'summarizeArticleContentFlow',
    inputSchema: SummarizeArticleContentInputSchema,
    outputSchema: SummarizeArticleContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeArticleContentPrompt(input);
    return output!;
  }
);
