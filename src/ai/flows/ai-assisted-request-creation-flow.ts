
'use server';
/**
 * @fileOverview An AI assistant for repair request creation.
 *
 * - aiAssistedRequestCreation - A function that provides AI-powered suggestions for repair requests.
 * - AiAssistedRequestCreationInput - The input type for the aiAssistedRequestCreation function.
 * - AiAssistedRequestCreationOutput - The return type for the aiAssistedRequestCreation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistedRequestCreationInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('A detailed description of the repair problem.'),
});
export type AiAssistedRequestCreationInput = z.infer<
  typeof AiAssistedRequestCreationInputSchema
>;

const AiAssistedRequestCreationOutputSchema = z.object({
  suggestedCauses: z
    .array(z.string())
    .describe('A list of potential causes for the reported problem.'),
  category: z
    .string()
    .describe(
      'An automatic category for the repair request, chosen from a predefined list.'
    ),
  recommendedEquipment: z
    .array(z.string())
    .describe(
      'A list of relevant equipment from the catalog that might be related to the problem.'
    ),
});
export type AiAssistedRequestCreationOutput = z.infer<
  typeof AiAssistedRequestCreationOutputSchema
>;

export async function aiAssistedRequestCreation(
  input: AiAssistedRequestCreationInput
): Promise<AiAssistedRequestCreationOutput> {
  return aiAssistedRequestCreationFlow(input);
}

const availableCategories = [
  'Thiết bị điện tử-CNTT',
  'Thiết bị điện',
  'Thiết bị nước',
  'Các loại thiết bị khác',
];

const equipmentCatalog = [
  'Máy chiếu',
  'cáp tín hiệu (HDMI, VGA)',
  'Âm thanh',
  'Màn chiếu',
  'Bóng đèn',
  'Ổ cắm điện',
  'Bàn cầu',
  'Lavabo',
  'Bàn',
  'Ghế',
  'Gạch nền',
  'Laphong',
];

const prompt = ai.definePrompt({
  name: 'aiAssistedRequestCreationPrompt',
  input: {schema: AiAssistedRequestCreationInputSchema},
  output: {schema: AiAssistedRequestCreationOutputSchema},
  prompt: `You are an intelligent assistant designed to help users create accurate and complete repair requests for a university's equipment management system.

Analyze the user's problem description and provide the following:
1.  A list of potential causes for the problem.
2.  An appropriate category for the request from the following list: {{{availableCategories}}}.
    - Thiết bị điện tử-CNTT: Máy chiếu, cáp tín hiệu, Âm thanh, Màn chiếu, v.v.
    - Thiết bị điện: Bóng đèn, quạt, ổ cắm, hệ thống điện.
    - Thiết bị nước: Bàn cầu, Lavabo, vòi nước, đường ống.
    - Các loại thiết bị khác: Bàn, ghế, gạch nền, laphong, cửa, v.v.
3.  A list of relevant equipment from the following catalog that might be involved in or related to the problem: {{{equipmentCatalog}}}.

Problem Description: {{{problemDescription}}}`,
});

const aiAssistedRequestCreationFlow = ai.defineFlow(
  {
    name: 'aiAssistedRequestCreationFlow',
    inputSchema: AiAssistedRequestCreationInputSchema,
    outputSchema: AiAssistedRequestCreationOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      availableCategories: availableCategories.join(', '),
      equipmentCatalog: equipmentCatalog.join(', '),
    });
    return output!;
  }
);
