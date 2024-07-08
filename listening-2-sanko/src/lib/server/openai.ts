import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAI } from 'openai';

export const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateResponse(sender: string, quantity: number, animation: string) {
  const prompt = `Generate a funny and witty response thanking ${sender} for gifting ${quantity} ${animation}(s). The response should be brief (max 2 sentences) and might include a joke or pun related to the sender's name if applicable. For example, if the sender's name is "frankTheBarber", you might say something like "Thanks for the ${quantity} ${animation}, frankTheBarber! Is this dude even a real barber?" Keep it lighthearted and entertaining.`;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 60
  });

  return chatCompletion.choices[0].message.content;

}
