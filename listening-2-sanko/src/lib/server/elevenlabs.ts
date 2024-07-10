import { ElevenLabsClient } from "elevenlabs";
import { ELEVENLABS_API_KEY } from '$env/static/private';

if (!ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const createAudioStreamFromText = async (
  text: string
): Promise<Buffer> => {
  const audioStream = await client.generate({
    voice: "Dr. Joe", // You can change this to your preferred voice
    model_id: "eleven_turbo_v2",
    voice_settings: {
      "stability": 0.1,
      "similarity_boost": 1,
    },
    text,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  const content = Buffer.concat(chunks);
  return content;
};
