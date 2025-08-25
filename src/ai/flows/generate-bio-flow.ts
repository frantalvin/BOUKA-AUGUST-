'use server';
/**
 * @fileOverview An AI flow for generating a biography for a family member.
 *
 * - generateBio - A function that handles the biography generation process.
 * - GenerateBioInput - The input type for the generateBio function.
 * - GenerateBioOutput - The return type for the generateBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBioInputSchema = z.object({
  firstName: z.string().describe("The person's first name."),
  lastName: z.string().describe("The person's last name."),
  dob: z.string().describe("The person's date of birth."),
  parentName: z.string().optional().describe("The name of the person's parent."),
});
export type GenerateBioInput = z.infer<typeof GenerateBioInputSchema>;

const GenerateBioOutputSchema = z.string();
export type GenerateBioOutput = z.infer<typeof GenerateBioOutputSchema>;


const bioPrompt = ai.definePrompt({
    name: 'bioPrompt',
    input: { schema: GenerateBioInputSchema },
    output: { schema: GenerateBioOutputSchema },
    prompt: `Tu es un biographe de famille talentueux. Rédige une courte biographie narrative et créative (environ 100-150 mots) pour la personne suivante. 
    Rends-la intéressante et personnelle.
    
    Détails :
    - Prénom : {{{firstName}}}
    - Nom de famille : {{{lastName}}}
    - Date de naissance : {{{dob}}}
    {{#if parentName}}- Parent : {{{parentName}}}{{/if}}
    
    Commence l'histoire de manière engageante. Si c'est un parent, décris-le comme le fondateur/la fondatrice de la lignée. S'il a un parent, mentionne sa filiation.
    Sois créatif et écris dans un style littéraire.`,
});


const generateBioFlow = ai.defineFlow(
  {
    name: 'generateBioFlow',
    inputSchema: GenerateBioInputSchema,
    outputSchema: GenerateBioOutputSchema,
  },
  async (input) => {
    const {output} = await bioPrompt(input);
    return output!;
  }
);


export async function generateBio(input: GenerateBioInput): Promise<GenerateBioOutput> {
  return generateBioFlow(input);
}
