'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-powered natural language search of government services.
 *
 * - aiPoweredServiceSearch - A function to search for government services and documents using a natural language query.
 * - AiPoweredServiceSearchInput - The input type for the aiPoweredServiceSearch function.
 * - AiPoweredServiceSearchOutput - The return type for the aiPoweredServiceSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ServiceSchema = z.object({
  title: z.string().describe('The title of the government service.'),
  description: z.string().describe('A short description of the service.'),
  department: z
    .string()
    .describe('The government department offering this service.'),
  departmentIconName: z.string().describe('The name of the lucide icon associated with the department.'),
  link: z.string().describe('The official link or route for the service.'),
  type: z
    .enum(['citizen', 'departmental'])
    .describe('Whether the service is for citizens or other departments.'),
});

const AiPoweredServiceSearchInputSchema = z.object({
  searchQuery: z
    .string()
    .describe('The user query for government services.'),
  availableServices: z.array(ServiceSchema).describe('The list of available government services.'),
});
export type AiPoweredServiceSearchInput = z.infer<typeof AiPoweredServiceSearchInputSchema>;

const AiPoweredServiceSearchOutputSchema = z.object({
  results: z
    .array(ServiceSchema)
    .describe('A list of matching government services.'),
});
export type AiPoweredServiceSearchOutput = z.infer<typeof AiPoweredServiceSearchOutputSchema>;

export async function aiPoweredServiceSearch(
  input: AiPoweredServiceSearchInput
): Promise<AiPoweredServiceSearchOutput> {
  return aiPoweredServiceSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredServiceSearchPrompt',
  input: { schema: AiPoweredServiceSearchInputSchema },
  output: { schema: AiPoweredServiceSearchOutputSchema },
  prompt: `You are GovConnect, an AI-powered assistant. 
Find the most relevant services for the query from the provided list. 
Return up to 5 matches.

User Query: "{{searchQuery}}"

Available Services:
{{#each availableServices}}
- "{{title}}": {{description}} (Dept: {{department}}, Link: {{link}}, Icon: {{departmentIconName}}, Type: {{type}})
{{/each}}`,
});

const aiPoweredServiceSearchFlow = ai.defineFlow(
  {
    name: 'aiPoweredServiceSearchFlow',
    inputSchema: AiPoweredServiceSearchInputSchema,
    outputSchema: AiPoweredServiceSearchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
