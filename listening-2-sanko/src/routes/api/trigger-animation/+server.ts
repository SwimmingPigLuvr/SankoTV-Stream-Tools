import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

let clients: Set<ReadableStreamDefaultController> = new Set();

export const POST: RequestHandler = async ({ request }) => {
    const { animation } = await request.json();
    console.log(`Animation triggered: ${animation}`);
    
    clients.forEach(client => {
        try {
            client.enqueue(`data: ${JSON.stringify({ animation })}\n\n`);
        } catch (error) {
            console.error('Error sending event to client:', error);
            clients.delete(client);
        }
    });

    return json({ success: true, message: `Animation ${animation} triggered` });
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
