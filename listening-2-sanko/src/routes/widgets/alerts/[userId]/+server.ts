// routes/widgets/alerts/[userId]/+server.ts
import WebSocket from 'ws';
import crypto from 'crypto';
import { json } from '@sveltejs/kit';

let connections = new Map();

let lastTestTime = 0;
const TEST_COOLDOWN = 5000;

function createWebSocketConnection(userId: string, streamerAddress: string) {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const WS_URL = `wss://chat.sanko.tv/ws?streamerAddress=${streamerAddress}&uniqueId=${uniqueId}`;

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
        console.log(`Connected to Sanko.tv chat for user ${userId}`);
    });

    socket.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log(`Received for user ${userId}:`, JSON.stringify(message, null, 2));
            
            const userConnection = connections.get(userId);
            if (userConnection) {
                if (message.event === 'CHAT') {
                    const chatMessage = message.data.event.content;
                    const senderName = message.data.event.sender.attributes.name;

                    if (chatMessage.toLowerCase() === '!test') {
                        const currentTime = Date.now();
                        if (currentTime - lastTestTime > TEST_COOLDOWN) {
                            lastTestTime = currentTime;
                            // simulate donation
                            userConnection.lastEvent = {
                                event: 'GIFT',
                                data: {
                                    event: {
                                        type: 'GIFT',
                                        attributes: {
                                            giftName: 'TestGift',
                                            quantity: '1',
                                            name: senderName
                                        }
                                    }
                                }
                            };
                            console.log('test alert triggered by: ', senderName);
                        } else {
                            console.log('test alert on cooldown. ignoring command from ', senderName)
                        }
                    } else {
                        // store real chat message
                        userConnection.lastEvent = {
                            event: 'CHAT',
                            data: {
                                sender: senderName,
                                content: chatMessage,
                            }
                        };
                    }
                } else {
                    userConnection.lastEvent = message;
                }
            }
        } catch (error) {
            console.error(`Error parsing message for user ${userId}:`, error);
        }
    });

    socket.on('close', (code, reason) => {
        console.log(`Disconnected from Sanko.tv chat for user ${userId}. Code: ${code}, Reason: ${reason}`);
        // Implement reconnection logic here
        setTimeout(() => createWebSocketConnection(userId, streamerAddress), 5000);
    });

    socket.on('error', (error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
    });

    // Implement ping logic
    const pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ event: 'PING' }));
        }
    }, 20000);

    connections.set(userId, { socket, lastEvent: null, pingInterval });
}

export function GET({ params }) {
    const { userId } = params;
    // You would typically fetch the streamer address based on the userId
    const streamerAddress = '0x5362c04666c92810f8fa72291a4ce60e51a128a2'; // Replace with actual logic to get streamer address

    if (!connections.has(userId)) {
        console.log(`Creating new WebSocket connection for user ${userId}`);
        createWebSocketConnection(userId, streamerAddress);
    }

    const userConnection = connections.get(userId);
    return json({ lastEvent: userConnection ? userConnection.lastEvent : null });
}

export async function POST({ params, request }) {
    const { userId } = params;
    const testEvent = await request.json();
    
    let userConnection = connections.get(userId);
    if (!userConnection) {
        console.log(`No active connection for user ${userId}. Creating a new one.`);
        const streamerAddress = '0x5362c04666c92810f8fa72291a4ce60e51a128a2'; // Replace with actual logic to get streamer address
        createWebSocketConnection(userId, streamerAddress);
        userConnection = connections.get(userId);
    }

    if (userConnection) {
        userConnection.lastEvent = {
            event: 'GIFT',
            data: { event: testEvent }
        };
        console.log(`Processed test event for user ${userId}:`, testEvent);
    } else {
        console.error(`Failed to create connection for user ${userId}`);
        return json({ success: false, message: 'Failed to process test event' }, { status: 500 });
    }

    return json({ success: true, message: 'Test event processed' });
}

export function DELETE({ params }) {
    const { userId } = params;
    const userConnection = connections.get(userId);
    if (userConnection) {
        clearInterval(userConnection.pingInterval);
        userConnection.socket.close();
        connections.delete(userId);
        console.log(`Closed and removed connection for user ${userId}`);
    }
    return json({ success: true, message: 'Connection closed' });
}
