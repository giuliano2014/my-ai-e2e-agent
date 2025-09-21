import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const openai = createOpenAI({
  apiKey,
});

export async function askGPT(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: openai.chat('gpt-3.5-turbo'), // ← tu peux aussi tester 'gpt-4'
    prompt,
  });

  return text;
}
