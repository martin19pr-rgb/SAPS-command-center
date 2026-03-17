'use server';
/**
 * @fileOverview A Genkit flow for predicting crime hotspots, high-risk times, and recommending patrol routes.
 *
 * - predictiveCrimeHotspots - A function that handles the crime prediction process.
 * - PredictiveCrimeHotspotsInput - The input type for the predictiveCrimeHotspots function.
 * - PredictiveCrimeHotspotsOutput - The return type for the predictiveCrimeHotspots function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictiveCrimeHotspotsInputSchema = z.object({
  historicalCrimeSummary: z
    .string()
    .describe(
      'A summary of historical crime data, including types, locations, and times.'
    ),
  currentEventSummary: z
    .string()
    .describe(
      'A summary of recent or ongoing events that might influence crime patterns.'
    ),
  patrolAreaDescription: z
    .string()
    .describe(
      'A description of the geographical area for which patrol routes need to be optimized.'
    ),
});
export type PredictiveCrimeHotspotsInput = z.infer<
  typeof PredictiveCrimeHotspotsInputSchema
>;

const PredictiveCrimeHotspotsOutputSchema = z.object({
  crimeHotspots: z
    .array(z.string())
    .describe('An array of locations identified as potential crime hotspots.'),
  highRiskTimes: z
    .array(z.string())
    .describe('An array of time windows identified as high-risk for criminal activity.'),
  recommendedPatrolRoutes: z
    .array(z.string())
    .describe('An array of descriptions for optimized patrol routes.'),
  riskAssessmentSummary: z
    .string()
    .describe('A summary of the overall risk assessment and rationale.'),
});
export type PredictiveCrimeHotspotsOutput = z.infer<
  typeof PredictiveCrimeHotspotsOutputSchema
>;

export async function predictiveCrimeHotspots(
  input: PredictiveCrimeHotspotsInput
): Promise<PredictiveCrimeHotspotsOutput> {
  return predictiveCrimeHotspotsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveCrimeHotspotsPrompt',
  input: { schema: PredictiveCrimeHotspotsInputSchema },
  output: { schema: PredictiveCrimeHotspotsOutputSchema },
  prompt: `You are an expert AI crime analyst for a police department. Your task is to analyze provided information to identify potential crime hotspots, predict high-risk times, and recommend optimized patrol routes.

Analyze the following historical crime data:
{{{historicalCrimeSummary}}}

Consider these current events:
{{{currentEventSummary}}}

Focus on optimizing routes for this patrol area:
{{{patrolAreaDescription}}}

Based on your analysis, provide:
1. A list of specific crime hotspots.
2. A list of high-risk time windows.
3. Descriptions of optimized patrol routes.
4. A summary of your risk assessment and rationale.

Ensure your output is a JSON object matching the PredictiveCrimeHotspotsOutputSchema.
`,
});

const predictiveCrimeHotspotsFlow = ai.defineFlow(
  {
    name: 'predictiveCrimeHotspotsFlow',
    inputSchema: PredictiveCrimeHotspotsInputSchema,
    outputSchema: PredictiveCrimeHotspotsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
