'use server';

/**
 * @fileOverview An AI agent to generate a cohesive room theme based on a prompt.
 *
 * - generateRoomTheme - A function that handles the room theme generation process.
 * - GenerateRoomThemeInput - The input type for the generateRoomTheme function.
 * - GenerateRoomThemeOutput - The return type for the generateRoomTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoomThemeInputSchema = z.object({
  prompt: z.string().describe('A description of the desired room theme.'),
});
export type GenerateRoomThemeInput = z.infer<typeof GenerateRoomThemeInputSchema>;

const GenerateRoomThemeOutputSchema = z.object({
  themeDescription: z.string().describe('A detailed description of the generated room theme.'),
  image: z.string().describe('An image representing the theme, as a data URI.'),
});
export type GenerateRoomThemeOutput = z.infer<typeof GenerateRoomThemeOutputSchema>;

export async function generateRoomTheme(input: GenerateRoomThemeInput): Promise<GenerateRoomThemeOutput> {
  return generateRoomThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoomThemePrompt',
  input: {schema: GenerateRoomThemeInputSchema},
  output: {schema: GenerateRoomThemeOutputSchema},
  prompt: `You are an interior design assistant. Generate a cohesive and detailed room theme based on the following prompt: {{{prompt}}}. Return the theme description and a URL for an image representing the theme.

Output the theme description in a detailed manner. Ensure the image represents the described theme accurately.`,
});

const generateRoomThemeFlow = ai.defineFlow(
  {
    name: 'generateRoomThemeFlow',
    inputSchema: GenerateRoomThemeInputSchema,
    outputSchema: GenerateRoomThemeOutputSchema,
  },
  async input => {
    const {text} = await ai.generate({
      prompt: `Generate an image representing this theme: ${input.prompt}`,
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    const {output} = await prompt(input);
    return { ...output!, image: text! };
  }
);
