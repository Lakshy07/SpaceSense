'use server';

/**
 * @fileOverview Wall design generation flow using generative AI.
 *
 * - generateWallDesign - A function that generates wall designs based on a textual prompt.
 * - GenerateWallDesignInput - The input type for the generateWallDesign function.
 * - GenerateWallDesignOutput - The return type for the generateWallDesign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWallDesignInputSchema = z.object({
  prompt: z.string().describe('A textual description of the desired wall design.'),
});
export type GenerateWallDesignInput = z.infer<typeof GenerateWallDesignInputSchema>;

const GenerateWallDesignOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'A data URI containing the generated wall design image. It must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type GenerateWallDesignOutput = z.infer<typeof GenerateWallDesignOutputSchema>;

export async function generateWallDesign(input: GenerateWallDesignInput): Promise<GenerateWallDesignOutput> {
  return generateWallDesignFlow(input);
}

const generateWallDesignPrompt = ai.definePrompt({
  name: 'generateWallDesignPrompt',
  input: {schema: GenerateWallDesignInputSchema},
  output: {schema: GenerateWallDesignOutputSchema},
  prompt: `Generate a realistic image of a wall design based on the following description: {{{prompt}}}. The image should be high quality and visually appealing.`,
});

const generateWallDesignFlow = ai.defineFlow(
  {
    name: 'generateWallDesignFlow',
    inputSchema: GenerateWallDesignInputSchema,
    outputSchema: GenerateWallDesignOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('No image was generated.');
    }

    return {imageDataUri: media.url};
  }
);
