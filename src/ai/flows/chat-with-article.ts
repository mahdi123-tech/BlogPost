'use server';

/**
 * @fileOverview A flow that answers questions about a blog article.
 *
 * - chatWithArticle - A function that answers questions.
 * - ChatWithArticleInput - The input type for the function.
 * - ChatWithArticleOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatHistorySchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatWithArticleInputSchema = z.object({
  articleContent: z.string().describe('The content of the article.'),
  chatHistory: z
    .array(ChatHistorySchema)
    .describe('The history of the conversation so far.'),
  userQuestion: z.string().describe("The user's latest question."),
});

export type ChatWithArticleInput = z.infer<typeof ChatWithArticleInputSchema>;

const ChatWithArticleOutputSchema = z.object({
  answer: z
    .string()
    .describe(
      "The answer to the user's question based on the article content and conversation history."
    ),
});

export type ChatWithArticleOutput = z.infer<typeof ChatWithArticleOutputSchema>;

export async function chatWithArticle(
  input: ChatWithArticleInput
): Promise<ChatWithArticleOutput> {
  return chatWithArticleFlow(input);
}

const chatWithArticlePrompt = ai.definePrompt({
  name: 'chatWithArticlePrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: ChatWithArticleInputSchema},
  output: {schema: ChatWithArticleOutputSchema},
  prompt: `You are a helpful assistant for the "AI Insights Hub" blog. Your role is to answer user questions based *only* on the provided article content. Do not use any external knowledge. If the answer is not in the article, say that you cannot find the answer in the provided text.

If the user expresses a desire to send an email or contact the author, you should instruct them to use the "Share Article" button on the page, which will open their email client. Do not ask for email details like recipient, subject, or body.

Here is the article content:
---
{{{articleContent}}}
---

Here is the conversation history:
---
{{#each chatHistory}}
{{role}}: {{content}}
{{/each}}
---

Here is the new user question:
{{{userQuestion}}}

Based on the article and the conversation history, provide a concise answer to the user's question.`,
});

const chatWithArticleFlow = ai.defineFlow(
  {
    name: 'chatWithArticleFlow',
    inputSchema: ChatWithArticleInputSchema,
    outputSchema: ChatWithArticleOutputSchema,
  },
  async input => {
    const {output} = await chatWithArticlePrompt(input);
    return output!;
  }
);
