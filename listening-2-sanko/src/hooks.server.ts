// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { setupWebSocketServer } from '$lib/server/websocket';

export const handle: Handle = async ({ event, resolve }) => {
    console.log('src/hooks.server.ts***');
    // Only try to set up WebSocket server in production
    if (process.env.NODE_ENV === 'production') {
        const { server } = event.platform;
        if (server) {
            setupWebSocketServer(server);
        }
    }

    const response = await resolve(event);
    return response;
};
