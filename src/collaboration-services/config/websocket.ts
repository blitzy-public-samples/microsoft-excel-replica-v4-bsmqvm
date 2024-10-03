import { Server as HttpServer } from 'http';
import WebSocket from 'ws';
import { config } from '../config';

// WebSocket port and path configuration
export const WS_PORT: number = parseInt(process.env.WS_PORT || '8080', 10);
export const WS_PATH: string = process.env.WS_PATH || '/ws';

/**
 * Creates and configures a WebSocket server attached to the provided HTTP server.
 * @param server The HTTP server to attach the WebSocket server to
 * @returns A configured WebSocket server
 */
export function createWebSocketServer(server: HttpServer): WebSocket.Server {
  const wss = new WebSocket.Server({
    server,
    port: WS_PORT,
    path: WS_PATH,
    clientTracking: true,
  });

  // Configure server options
  wss.options.maxPayload = 1024 * 1024; // 1MB max payload size
  wss.options.perMessageDeflate = {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024,
  };

  // Implement security options
  wss.options.verifyClient = (info, callback) => {
    // TODO: Implement proper authentication logic
    // This is a placeholder and should be replaced with actual authentication
    const isAuthenticated = true;
    callback(isAuthenticated, 401, 'Unauthorized');
  };

  // Set up connection handling
  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');

    ws.on('message', (message: string) => {
      console.log('Received message:', message);
      // TODO: Implement message handling logic
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      // TODO: Implement cleanup logic
    });

    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
      // TODO: Implement error handling logic
    });
  });

  return wss;
}

// Export any shared configuration settings
export { config };