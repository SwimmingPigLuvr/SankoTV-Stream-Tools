import { WebSocketServer } from 'ws';
import type { Server } from 'http';

let wss: WebSocketServer;

export function setupWebSocketServer(server: Server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log('Received:', message);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}

export function broadcastAnimationTrigger(animation: string) {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'animation', animation }));
      }
    });
  } else {
    console.log(`animation triggered: ${animation}`);
  }
}
