'use server';
/**
 * @fileOverview A Genkit flow for automatically suggesting the most suitable officer for an incident.
 *
 * - automatedOfficerDispatch - A function that handles the automated officer dispatch process.
 * - AutomatedOfficerDispatchInput - The input type for the automatedOfficerDispatch function.
 - AutomatedOfficerDispatchOutput - The return type for the automatedOfficerDispatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema Definition
const AutomatedOfficerDispatchInputSchema = z.object({
  incident: z.object({
    id: z.string().describe('Unique identifier for the incident.'),
    locationDescription: z.string().describe('Human-readable description of the incident location.'),
    severity: z.enum(['low', 'medium', 'high', 'critical']).describe('Severity level of the incident.'),
    description: z.string().describe('Detailed description of the incident.'),
  }),
  officers: z.array(
    z.object({
      id: z.string().describe('Unique identifier for the officer.'),
      currentLocationDescription: z.string().describe('Human-readable description of the officer\'s current location.'),
      status: z.enum(['Standby', 'Enroute', 'At Scene']).describe('Current status of the officer.'),
      currentWorkloadScore: z.number().min(0).max(10).describe('Numeric score representing the officer\'s current workload (0 = no workload, 10 = max workload).'),
      distanceToIncidentKm: z.number().min(0).describe('Calculated distance in kilometers from the officer to the incident.'),
      estimatedTravelTimeMinutes: z.number().min(0).describe('Estimated travel time in minutes for the officer to reach the incident.'),
    })
  ).describe('List of available officers with their details, including pre-calculated distance and ETA to the incident.'),
});
export type AutomatedOfficerDispatchInput = z.infer<typeof AutomatedOfficerDispatchInputSchema>;

// Output Schema Definition
const AutomatedOfficerDispatchOutputSchema = z.object({
  suggestedOfficerId: z.string().describe('The ID of the officer suggested for dispatch.'),
  estimatedArrivalTimeMinutes: z.number().describe('The estimated time of arrival for the suggested officer to the incident, in minutes.'),
  reasoning: z.string().describe('A detailed explanation of why this officer was selected, considering proximity, workload, and incident severity.'),
});
export type AutomatedOfficerDispatchOutput = z.infer<typeof AutomatedOfficerDispatchOutputSchema>;

// Wrapper function
export async function automatedOfficerDispatch(input: AutomatedOfficerDispatchInput): Promise<AutomatedOfficerDispatchOutput> {
  return automatedOfficerDispatchFlow(input);
}

// Genkit Prompt Definition
const dispatchPrompt = ai.definePrompt({
  name: 'automatedOfficerDispatchPrompt',
  input: {schema: AutomatedOfficerDispatchInputSchema},
  output: {schema: AutomatedOfficerDispatchOutputSchema},
  prompt: `You are an AI automated dispatch engine for emergency services.
Your task is to analyze the provided incident details and a list of available officers to suggest the most suitable officer for dispatch.
Consider the following factors in your decision-making process, in order of priority:
1.  **Incident Severity**: Critical incidents take highest priority. Higher severity incidents should ideally be handled by officers with lower workload and closer proximity.
2.  **Officer Status**: Only officers on "Standby" should be considered primary candidates. Officers "Enroute" or "At Scene" are generally unavailable unless no other options exist for critical incidents.
3.  **Proximity**: Officers closer to the incident are preferred to minimize response times.
4.  **Workload**: Officers with lower current workload scores are preferred to ensure efficiency and officer safety.

Incident Details:
ID: {{{incident.id}}}
Location: {{{incident.locationDescription}}}
Severity: {{{incident.severity}}}
Description: {{{incident.description}}}

Available Officers:
{{#if officers}}
{{#each officers}}
- Officer ID: {{{id}}}, Location: {{{currentLocationDescription}}}, Status: {{{status}}}, Workload: {{{currentWorkloadScore}}} (out of 10), Distance to incident: {{{distanceToIncidentKm}}} km, Estimated travel time: {{{estimatedTravelTimeMinutes}}} minutes.
{{/each}}
{{else}}
No officers available.
{{/if}}

Based on the above information, identify the best officer to dispatch.
Provide the suggested officer's ID, their estimated arrival time in minutes, and a clear reasoning for your selection, explaining how you weighed the factors (severity, status, proximity, workload).
If no suitable officer can be found, specify this in the reasoning and suggest a fallback.
`,
});

// Genkit Flow Definition
const automatedOfficerDispatchFlow = ai.defineFlow(
  {
    name: 'automatedOfficerDispatchFlow',
    inputSchema: AutomatedOfficerDispatchInputSchema,
    outputSchema: AutomatedOfficerDispatchOutputSchema,
  },
  async (input) => {
    // Basic validation or pre-processing can happen here if needed.
    // For this flow, we directly pass the input to the prompt.

    const {output} = await dispatchPrompt(input);

    if (!output) {
      throw new Error('Failed to get a dispatch suggestion from the AI.');
    }
    return output;
  }
);
