import WebSocket from 'ws';
import crypto from 'crypto';

const streamerAddress = '0x5362c04666c92810f8fa72291a4ce60e51a128a2';
const uniqueId = crypto.randomBytes(16).toString('hex');
const WS_URL = `wss://chat.sanko.tv/ws?streamerAddress=${streamerAddress}&uniqueId=${uniqueId}`;

const SVELTEKIT_SERVER = 'http://localhost:5173';

function connectWebSocket() {
    const socket = new WebSocket(WS_URL, {
        headers: {
            'Pragma': 'no-cache',
            'Origin': 'https://sanko.tv',
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Cache-Control': 'no-cache',
        },
        perMessageDeflate: {
            clientMaxWindowBits: true,
        },
    });

    socket.on('open', () => {
        console.log('Connected to Sanko.tv chat');
        // Send a "hello" message if needed
        // socket.send(JSON.stringify({ event: 'HELLO', data: { client: 'custom', version: '1.0.0' } }));
    });

    socket.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log('Received:', message);
            
            switch (message.event) {
                case 'CHAT':
                    const chatData = message.data.event;
                    const senderName = chatData.sender.attributes.name || 'anon';
                    console.log(`${senderName}: ${chatData.content}`);

                    if (chatData.content.includes(':SwimmingPigLuvr_Shredcat:')) {
                        triggerAnimation('shredcat');
                    } else if (chatData.content.includes(':SwimmingPigLuvr_sleep:')) {
                        triggerAnimation('sleep');
                    }

                    if (chatData.emotes && chatData.emotes.length > 0) {
                        console.log('emotes used: ', chatData.emotes);
                    }
                case 'EMOTE':
                    const emoteData = message.data.event;
                    const emoteSenderName = emoteData.sender.attributes.name || 'anon';
                    console.log(`EMOTE from ${emoteSenderName}: ${emoteData.content}`);
                    break;
                case 'DICEROLL':
                    const diceData = message.data.event;
                    const diceSenderName = diceData.sender.attributes.name || 'anon';
                    console.log(`DICEROLL from ${diceSenderName}: ${diceData.content}`);
                    break;
                case 'COINFLIP':
                    const coinData = message.data.event;
                    const coinSenderName = coinData.sender.attributes.name || 'anon';
                    console.log(`COINFLIP from ${coinSenderName}: ${coinData.content}`);
                    break;
                case 'GIFT':
                    const giftData = message.data.event;
                    const giftName = giftData.attributes.giftName;
                    const giftSenderName = giftData.attributes.name || '';
                    const giftQuantity = giftData.attributes.quantity;
                    console.log(`${giftSenderName} SENT ${giftQuantity} ${giftName} + ${giftQuantity > 1 ? 's!' : ''}`);


                    if (giftName === "Zyn") {
                        triggerGiftAnimation('zyn', giftSenderName, giftQuantity);
                    }



                    break;
                case 'PONG':
                    console.log('received pong');
                    break;
                default:
                    console.log(`unhandled event type: ${message.event}`);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
            console.error('raw: ', data.toString());
        }
    });

    function triggerAnimation(animation) {
        fetch(`${SVELTEKIT_SERVER}/api/trigger-animation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ animation })
        }).then(response => response.json())
          .then(data => console.log('Animation triggered:', data))
          .catch(error => console.error('Error triggering animation:', error));
    }

    function triggerGiftAnimation(animation, sender, quantity) {
        fetch(`${SVELTEKIT_SERVER}/api/trigger-gift-animation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ animation, sender, quantity })
        }).then(response => response.json())
            .then(data => console.log('Gift Animation triggered:', data))
            .catch(error => console.error('error triggering animation:', error));
    }


    socket.on('close', (code, reason) => {
        console.log(`Disconnected from Sanko.tv chat. Code: ${code}, Reason: ${reason}`);
        // Implement reconnection logic here
        setTimeout(connectWebSocket, 5000);
    });

    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
        if (error.message) {
            console.error('Error message:', error.message);
        }
        if (error.code) {
            console.error('Error code:', error.code);
        }
    });


    // Implement ping logic
    setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ event: 'PING' }));
        }
    }, 20000);
}

connectWebSocket();
