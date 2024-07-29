import { JWT_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from "@sveltejs/kit";
import jwt from 'jsonwebtoken';

export const POST: RequestHandler = async ({ request }) => {
  const { address } = await request.json();

  if (!address) {
    return json({ error: 'address required'}, { status: 400 });
  }
  try {
    const token = jwt.sign({ sub: address.toLowerCase() }, JWT_TOKEN, { expiresIn: '1d' });
    return json({ token });
  } catch (error) {
    console.error('Error generating JWT:', error);
    return json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
