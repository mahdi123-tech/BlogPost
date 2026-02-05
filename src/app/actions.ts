'use server';

import { summarizeArticleContent } from '@/ai/flows/summarize-article-content';
import { z } from 'zod';

const inputSchema = z.object({
  articleContent: z.string().min(100, "Article content is too short."),
});

export async function getSummaryAction(
  prevState: { summary: string | null; error: string | null },
  formData: FormData
) {
  const validatedFields = inputSchema.safeParse({
    articleContent: formData.get('articleContent'),
  });

  if (!validatedFields.success) {
    return {
      summary: null,
      error: 'Invalid input. Please provide valid article content.',
    };
  }

  try {
    const result = await summarizeArticleContent({
      articleContent: validatedFields.data.articleContent,
    });
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error('Error summarizing article:', error);
    return {
      summary: null,
      error: 'Failed to generate summary. Please try again later.',
    };
  }
}
