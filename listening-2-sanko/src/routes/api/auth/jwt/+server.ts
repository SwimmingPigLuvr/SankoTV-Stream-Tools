import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    const { address, message, signature } = await request.json();

    // Verify the signature
    const signerAddress = ethers.utils.verifyMessage(message, signature);
    
    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({
        aud: 'authenticated',
        role: 'authenticated',
        sub: address,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours from now
    }, JWT_SECRET);

    return new Response(JSON.stringify({ token }), {
        headers: { 'Content-Type': 'application/json' }
    });
};
