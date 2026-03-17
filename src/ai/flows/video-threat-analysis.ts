'use server';
/**
 * @fileOverview This file implements a Genkit flow for analyzing video feeds to detect threats.
 *
 * - videoThreatAnalysis - A function that analyzes a video frame or clip for threats.
 * - VideoThreatAnalysisInput - The input type for the videoThreatAnalysis function.
 * - VideoThreatAnalysisOutput - The return type for the videoThreatAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Define the input schema for video threat analysis
const VideoThreatAnalysisInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video frame or short video clip, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  context: z
    .string()
    .optional()
    .describe('Additional textual context or information related to the incident or video feed.'),
});
export type VideoThreatAnalysisInput = z.infer<typeof VideoThreatAnalysisInputSchema>;

// Define the output schema for video threat analysis
const VideoThreatAnalysisOutputSchema = z.object({
  threatLevel: z
    .enum(['None', 'Low', 'Medium', 'High', 'Critical'])
    .describe('The assessed threat level of the situation.'),
  detectedObjects: z
    .array(z.string())
    .describe('A list of significant objects detected in the video, e.g., weapon, person, vehicle, fire, smoke.'),
  suspiciousBehaviors: z
    .array(z.string())
    .describe('A list of suspicious behaviors identified, e.g., hostile gestures, concealed object retrieval, unusual congregation.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A confidence score (0-100) for the analysis, indicating certainty.'),
  summary: z.string().describe('A brief textual summary of the video analysis and its implications.'),
});
export type VideoThreatAnalysisOutput = z.infer<typeof VideoThreatAnalysisOutputSchema>;

// Wrapper function to call the Genkit flow
export async function videoThreatAnalysis(
  input: VideoThreatAnalysisInput
): Promise<VideoThreatAnalysisOutput> {
  return videoThreatAnalysisFlow(input);
}

// Define the Genkit prompt for video threat analysis
const videoThreatAnalysisPrompt = ai.definePrompt({
  name: 'videoThreatAnalysisPrompt',
  input: { schema: VideoThreatAnalysisInputSchema },
  output: { schema: VideoThreatAnalysisOutputSchema },
  model: googleAI.model('gemini-2.5-flash-image'),
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE', // Allow detection of dangerous content like weapons for threat analysis
      },
      {
        category: 'HARM_CATEGORY_VIOLENCE',
        threshold: 'BLOCK_NONE', // Allow detection of violence for threat analysis
      },
    ],
  },
  prompt: `You are an expert security analyst for a command center, specializing in real-time threat assessment from video feeds.
Your task is to analyze the provided video frame or short clip and identify any potential threats.

Based on the visual evidence and any provided context, perform the following:
1.  **Detect Objects**: List any significant objects present that could indicate a threat (e.g., weapons, fire, smoke, unusual items).
2.  **Identify Suspicious Behaviors**: Describe any suspicious actions or behaviors observed (e.g., hostile gestures, brandishing, concealed object retrieval, unusual congregation).
3.  **Assign Threat Level**: Determine an overall threat level from the following categories: 'None', 'Low', 'Medium', 'High', 'Critical'.
4.  **Confidence Score**: Provide a confidence score (0-100) for your assessment.
5.  **Summary**: Provide a concise summary of your findings and the reasons for the assigned threat level.

Return your analysis in a structured JSON format matching the output schema.

Video/Frame for Analysis: {{media url=videoDataUri}}

{{#if context}}
Additional Context: {{{context}}}
{{/if}}`,
});

// Define the Genkit flow for video threat analysis
const videoThreatAnalysisFlow = ai.defineFlow(
  {
    name: 'videoThreatAnalysisFlow',
    inputSchema: VideoThreatAnalysisInputSchema,
    outputSchema: VideoThreatAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await videoThreatAnalysisPrompt(input);
    if (!output) {
      throw new Error('Failed to get output from video threat analysis prompt.');
    }
    return output;
  }
);
