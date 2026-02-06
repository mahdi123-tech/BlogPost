'use server';

import { summarizeArticleContent } from '@/ai/flows/summarize-article-content';
import { chatWithArticle } from '@/ai/flows/chat-with-article';
import { z } from 'zod';
import nodemailer from 'nodemailer';

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

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const chatSchema = z.object({
  articleContent: z.string(),
  messages: z.string(), // JSON string of ChatMessage[]
  userQuestion: z.string().min(1, 'Question cannot be empty.'),
});

export async function chatAction(
  prevState: { messages: ChatMessage[]; error: string | null },
  formData: FormData
): Promise<{ messages: ChatMessage[]; error: string | null }> {
  const validatedFields = chatSchema.safeParse({
    articleContent: formData.get('articleContent'),
    messages: formData.get('messages'),
    userQuestion: formData.get('userQuestion'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      error: 'Invalid input.',
    };
  }
  
  const { articleContent, userQuestion } = validatedFields.data;
  const currentMessages: ChatMessage[] = JSON.parse(validatedFields.data.messages);

  const newMessages: ChatMessage[] = [
      ...currentMessages,
      { role: 'user', content: userQuestion },
  ];

  try {
    const chatHistory = newMessages.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    const result = await chatWithArticle({
      articleContent,
      chatHistory,
      userQuestion,
    });
    
    return {
      messages: [...newMessages, { role: 'model', content: result.answer }],
      error: null,
    };
  } catch (error) {
    console.error('Error in chat action:', error);
    return {
      ...prevState,
      messages: [...newMessages, { role: 'model', content: "Sorry, I encountered an error. Please try again." }],
      error: 'Failed to get response from AI.',
    };
  }
}

const feedbackSchema = z.object({
  feedback: z.string().min(1, 'Feedback cannot be empty.'),
});

export async function sendFeedbackAction(
  prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const validatedFields = feedbackSchema.safeParse({
    feedback: formData.get('feedback'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input. Please provide feedback.',
    };
  }

  const { feedback } = validatedFields.data;

  const senderEmail = process.env.EMAIL_SENDER;
  const appPassword = process.env.EMAIL_APP_PASSWORD;

  if (!senderEmail || !appPassword) {
    console.error('Email credentials are not set in environment variables.');
    return {
      success: false,
      error: 'Server is not configured to send emails. Please contact support.',
    };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: senderEmail,
    to: senderEmail, // Sending to yourself
    subject: 'New Feedback for AI Insights Hub',
    text: feedback,
    html: `<p>You have received new feedback:</p><p><strong>${feedback}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error sending feedback email:', error);
    return {
      success: false,
      error: 'Failed to send feedback. Please try again later.',
    };
  }
}
