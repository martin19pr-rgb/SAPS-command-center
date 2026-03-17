'use server';
/**
 * @fileOverview This file provides a Genkit flow for parsing natural language commands into a structured JSON format.
 *
 * - naturalLanguageCommandInterface - A function that processes a natural language command.
 * - NaturalLanguageCommandInput - The input type for the naturalLanguageCommandInterface function.
 * - NaturalLanguageCommandOutput - The return type for the naturalLanguageCommandInterface function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NaturalLanguageCommandInputSchema = z.object({
  commandText: z.string().describe("The natural language command issued by the commander (e.g., 'Show all high-risk incidents', 'Locate Officer Smith')."),
});
export type NaturalLanguageCommandInput = z.infer<typeof NaturalLanguageCommandInputSchema>;

const NaturalLanguageCommandOutputSchema = z.discriminatedUnion("commandType", [
  z.object({
    commandType: z.literal("show"),
    entityType: z.enum(["incidents", "zones", "routes", "areas"]).describe("The type of entity to show (incidents, high-risk zones, patrol routes, emergency escalation areas)."),
    filter: z.string().optional().describe("An optional filter for the entity, e.g., 'all', 'active', 'high-risk', etc. Applicable to incidents and zones."),
  }),
  z.object({
    commandType: z.literal("locate"),
    entityType: z.literal("officer").describe("The type of entity to locate."),
    identifier: z.string().describe("The name or ID of the officer to locate (e.g., 'Officer Smith', 'Officer 247')."),
  }),
  z.object({
    commandType: z.literal("track"),
    entityType: z.literal("officer").describe("The type of entity to track."),
    identifier: z.string().describe("The name or ID of the officer to track (e.g., 'Officer Smith', 'Officer 247')."),
  }),
  z.object({
    commandType: z.literal("unknown"),
    rawCommand: z.string().describe("The original command text if the command type could not be determined."),
  }),
]);
export type NaturalLanguageCommandOutput = z.infer<typeof NaturalLanguageCommandOutputSchema>;

export async function naturalLanguageCommandInterface(
  input: NaturalLanguageCommandInput
): Promise<NaturalLanguageCommandOutput> {
  return naturalLanguageCommandInterfaceFlow(input);
}

const parseNaturalLanguageCommandPrompt = ai.definePrompt({
  name: 'parseNaturalLanguageCommandPrompt',
  input: {schema: NaturalLanguageCommandInputSchema},
  output: {schema: NaturalLanguageCommandOutputSchema},
  prompt: `You are an AI assistant for a command system called "Guardian Command". Your task is to parse natural language commands from a commander and convert them into a structured JSON format.

The commands will fall into a few categories:
1.  **Show commands**: These request to display information on the operational map. Examples: "Show all active incidents", "Show high-risk zones", "Show patrol routes", "Show emergency escalation areas".
2.  **Locate commands**: These request to find a specific officer's location. Examples: "Locate Officer Smith", "Find Officer 247".
3.  **Track commands**: These request to continuously track a specific officer. Examples: "Track Officer 247", "Monitor Officer Johnson".

Your output MUST strictly adhere to the JSON schema provided. If you cannot parse the command into one of the defined types, use the "unknown" commandType.

Here are some examples:
Command: "Show all high-risk incidents"
Output: { "commandType": "show", "entityType": "incidents", "filter": "high-risk" }

Command: "Show active incidents"
Output: { "commandType": "show", "entityType": "incidents", "filter": "active" }

Command: "Show high-risk zones"
Output: { "commandType": "show", "entityType": "zones", "filter": "high-risk" }

Command: "Show patrol routes"
Output: { "commandType": "show", "entityType": "routes" }

Command: "Show emergency escalation areas"
Output: { "commandType": "show", "entityType": "areas" }

Command: "Locate Officer Smith"
Output: { "commandType": "locate", "entityType": "officer", "identifier": "Officer Smith" }

Command: "Track Officer 247"
Output: { "commandType": "track", "entityType": "officer", "identifier": "Officer 247" }

Command: "What is the weather?"
Output: { "commandType": "unknown", "rawCommand": "What is the weather?" }

Command: "How do I zoom in?"
Output: { "commandType": "unknown", "rawCommand": "How do I zoom in?" }

Command: "{{commandText}}"`,
});

const naturalLanguageCommandInterfaceFlow = ai.defineFlow(
  {
    name: 'naturalLanguageCommandInterfaceFlow',
    inputSchema: NaturalLanguageCommandInputSchema,
    outputSchema: NaturalLanguageCommandOutputSchema,
  },
  async (input) => {
    const {output} = await parseNaturalLanguageCommandPrompt(input);
    return output!;
  }
);
