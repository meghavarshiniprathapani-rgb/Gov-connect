'use server';
/**
 * @fileOverview A Genkit flow for summarizing government documents and services or answering specific questions about their content.
 *
 * - intelligentDocumentAndServiceSummarizer - A function to summarize content or answer questions.
 * - IntelligentDocumentAndServiceSummarizerInput - The input type for the summarizer.
 * - IntelligentDocumentAndServiceSummarizerOutput - The return type for the summarizer.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntelligentDocumentAndServiceSummarizerInputSchema = z.object({
  content: z
    .string()
    .describe('The content of the government service or document to summarize or query.'),
  question: z
    .string()
    .optional()
    .describe('An optional specific question about the content.'),
});
export type IntelligentDocumentAndServiceSummarizerInput = z.infer<
  typeof IntelligentDocumentAndServiceSummarizerInputSchema
>;

const IntelligentDocumentAndServiceSummarizerOutputSchema = z.object({
  summaryOrAnswer: z
    .string()
    .describe('A concise summary of the content or an answer to the provided question.'),
});
export type IntelligentDocumentAndServiceSummarizerOutput = z.infer<
  typeof IntelligentDocumentAndServiceSummarizerOutputSchema
>;

export async function intelligentDocumentAndServiceSummarizer(
  input: IntelligentDocumentAndServiceSummarizerInput
): Promise<IntelligentDocumentAndServiceSummarizerOutput> {
  return intelligentDocumentAndServiceSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentDocumentAndServiceSummarizerPrompt',
  input: { schema: IntelligentDocumentAndServiceSummarizerInputSchema },
  output: { schema: IntelligentDocumentAndServiceSummarizerOutputSchema },
  prompt: `
{{#if question}}
  Answer the following question based on the provided government document or service content. If the question cannot be answered from the content, state that the information is not available in the document.

  Question: {{{question}}}

  Content:
  {{{content}}}
{{else}}
  Provide a concise summary of the following government document or service content. Focus on key information, main points, and purpose.

  Content:
  {{{content}}}
{{/if}}
  `,
});

const intelligentDocumentAndServiceSummarizerFlow = ai.defineFlow(
  {
    name: 'intelligentDocumentAndServiceSummarizerFlow',
    inputSchema: IntelligentDocumentAndServiceSummarizerInputSchema,
    outputSchema: IntelligentDocumentAndServiceSummarizerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
