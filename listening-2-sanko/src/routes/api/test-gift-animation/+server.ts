import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ fetch }) => {
    // Simulate the gift data
    const giftData = {
        event: 'GIFT',
        test: true, // Flag to indicate this is a test event
        data: {
            event: {
                attributes: {
                    name: 'TestUser',
                    quantity: '1',
                    giftName: 'Zyn'
                }
            }
        },

        response: `Thanks for the Zyn-credible gift, Swimming! Now I'm officially in the Zyn zone!`
    };

    // Send the data to the actual gift animation endpoint 
    const response = await fetch('/api/trigger-gift-animation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(giftData)
    });

    const result = await response.json();
    return json(result);
};
