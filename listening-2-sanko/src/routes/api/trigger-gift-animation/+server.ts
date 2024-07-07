import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { XI_API_KEY, OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

let clients: Set<ReadableStreamDefaultController> = new Set();

async function generateResponse(sender: string, quanity: number) {
    const prompt = `Generate a funny and witty response thanking ${sender} for gifting ${quantity} zyn(s). The response should be brief (max 2 sentences) and might include a joke or pun related to the sender's name if applicable. For example, if the sender's name is "frankTheBarber", you might say something like "Thanks for the ${quantity} zyns, frankTheBarber! Is this dude even a real barber?" Keep it lighthearted and entertaining.`;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60
    });

    return chatCompletion.choices[0].message.content;
}

export const POST: RequestHandler = async ({ request }) => {
    const { animation, sender, quanity } = await request.json();
    console.log(`Animation triggered: ${quanity}, ${animation}, ${sender},`);

    const response = await generateResponse(sender, quanity);

    clients.forEach(client => {
        try {
            client.enqueue(`data: ${JSON.stringify({ animation='zyn', sender, quanity, response })}\n\n`);
        } catch (error) {
            console.error('Error sending event to client:', error);
            clients.delete(client);
        }
    });

    return json({ success: true, message: `${animation} gift animation triggered!` });
};

export const GET: RequestHandler = async () => {
    const stream = new ReadableStream({
        start(controller) {
            clients.add(controller);
        },
        cancel(controller) {
            clients.delete(controller);
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
};
