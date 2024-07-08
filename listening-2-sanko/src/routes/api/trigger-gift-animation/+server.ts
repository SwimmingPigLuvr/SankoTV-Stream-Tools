import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { generateResponse } from '$lib/server/openai';

let clients: Set<ReadableStreamDefaultController> = new Set();

export const POST: RequestHandler = async ({ request }) => {
    const giftData = await request.json();
    console.log(`received gift data:`, giftData);

    let response;
    if (giftData.test) {
        response = giftData.response;
    } else {
        // For real events, extract the necessary data and generate a response
        const { name: sender, quantity } = giftData.data.event.attributes;
        const parsedQuantity = parseInt(quantity, 10);
        response = await generateResponse(sender, parsedQuantity);
    }

    const message = JSON.stringify({ ...giftData, response });
    console.log('sending message:', message);

    clients.forEach(client => {
        try {
            client.enqueue(`data: ${message})}\n\n`);
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
