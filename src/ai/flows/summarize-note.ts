'use server';

/**
 * @fileOverview Summarizes a note based on user prompts using generative AI.
 *
 * - summarizeNote - A function that summarizes the note content based on the user prompt.
 * - SummarizeNoteInput - The input type for the summarizeNote function, including note content and user prompt.
 * - SummarizeNoteOutput - The return type for the summarizeNote function, which is the summarized note content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNoteInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to be summarized.'),
  userPrompt: z.string().describe('The summarization prompt from the user.'),
});
export type SummarizeNoteInput = z.infer<typeof SummarizeNoteInputSchema>;

const SummarizeNoteOutputSchema = z.object({
  summary: z.string().describe('The summarized content of the note.'),
});
export type SummarizeNoteOutput = z.infer<typeof SummarizeNoteOutputSchema>;

export async function summarizeNote(input: SummarizeNoteInput): Promise<SummarizeNoteOutput> {
  return summarizeNoteFlow(input);
}

const summarizeNotePrompt = ai.definePrompt({
  name: 'summarizeNotePrompt',
  input: {schema: SummarizeNoteInputSchema},
  output: {schema: SummarizeNoteOutputSchema},
  prompt: `Summarize the following note content based on the user prompt.\n\nNote Content: {{{noteContent}}}\n\nUser Prompt: {{{userPrompt}}}\n\nSummary:`, // Provide clear instructions for summarization
});

const summarizeNoteFlow = ai.defineFlow(
  {
    name: 'summarizeNoteFlow',
    inputSchema: SummarizeNoteInputSchema,
    outputSchema: SummarizeNoteOutputSchema,
  },
  async input => {
    const {output} = await summarizeNotePrompt(input);
    return output!;
  }
);
