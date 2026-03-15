'use server';
/**
 * @fileOverview A financial coach AI agent that provides personalized advice based on investment goals and inputs.
 *
 * - getFinancialCoachAdvice - A function that handles the financial coach advice generation.
 * - FinancialCoachAdviceInput - The input type for the getFinancialCoachAdvice function.
 * - FinancialCoachAdviceOutput - The return type for the getFinancialCoachAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FinancialCoachAdviceInputSchema = z.object({
  goalCost: z.number().describe('The initial cost of the financial goal.'),
  yearsToGoal: z.number().describe('The number of years to reach the financial goal.'),
  inflationRate: z.number().describe('The annual inflation rate (as a decimal, e.g., 0.03 for 3%).'),
  expectedReturn: z.number().describe('The expected annual return on investment (as a decimal, e.g., 0.08 for 8%).'),
  monthlySIP: z.number().describe('The calculated monthly Systematic Investment Plan (SIP) required.'),
  futureGoalCost: z.number().describe('The calculated future cost of the goal after inflation.'),
  totalInvested: z.number().describe('The total amount invested over the period.'),
  totalReturns: z.number().describe('The total returns generated from the investment.'),
  finalValue: z.number().describe('The final value of the investment at the goal completion.'),
});
export type FinancialCoachAdviceInput = z.infer<typeof FinancialCoachAdviceInputSchema>;

const FinancialCoachAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized financial advice and suggestions.'),
});
export type FinancialCoachAdviceOutput = z.infer<typeof FinancialCoachAdviceOutputSchema>;

export async function getFinancialCoachAdvice(input: FinancialCoachAdviceInput): Promise<FinancialCoachAdviceOutput> {
  return financialCoachAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialCoachAdvicePrompt',
  input: { schema: FinancialCoachAdviceInputSchema },
  output: { schema: FinancialCoachAdviceOutputSchema },
  prompt: `You are a helpful and knowledgeable financial coach. Your goal is to provide personalized, context-aware suggestions and advice to optimize the user's investment plan.

Here are the user's current investment details and calculations:
- Initial Goal Cost: $ {{goalCost}}
- Years to Goal: {{yearsToGoal}} years
- Inflation Rate: {{inflationRate}} (e.g., 0.06 means 6%)
- Expected Annual Return: {{expectedReturn}} (e.g., 0.12 means 12%)
- Calculated Monthly SIP: $ {{monthlySIP}}
- Future Goal Cost (adjusted for inflation): $ {{futureGoalCost}}
- Total Invested Amount: $ {{totalInvested}}
- Total Returns Generated: $ {{totalReturns}}
- Final Investment Value: $ {{finalValue}}

Based on these details, please provide concise and actionable financial advice. Consider aspects like:
- Is the monthly SIP realistic for the goal and timeframe?
- What impact does the inflation rate have?
- How does the expected return affect the outcome?
- Are there any ways to reduce the monthly SIP (e.g., extend years to goal, increase expected return, reduce goal cost)?
- General financial planning best practices.

Provide your advice in a friendly and encouraging tone. Your advice should be contained within the 'advice' field in the JSON output.`,
});

const financialCoachAdviceFlow = ai.defineFlow(
  {
    name: 'financialCoachAdviceFlow',
    inputSchema: FinancialCoachAdviceInputSchema,
    outputSchema: FinancialCoachAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
