import type { RequestHandler } from './$types';
import { createAudioStreamFromText } from '$lib/server/elevenlabs';

export const POST: RequestHandler = async ({ request }) => {
    const { text } = await request.json();

    try {
        const audioBuffer = await createAudioStreamFromText(text);
        return new Response(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg'
            }
        });
    } catch (error) {
        console.error("Error in text-to-speech:", error);
        return new Response(JSON.stringify({ error: 'Text-to-speech failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
