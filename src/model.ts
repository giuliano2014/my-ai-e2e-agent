import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askGPT = async (prompt: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    // temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: 'Tu es un agent de test E2E qui agit dans une interface web.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content || '';
}
