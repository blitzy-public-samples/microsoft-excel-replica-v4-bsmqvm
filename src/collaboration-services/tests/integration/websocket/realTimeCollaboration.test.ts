import { jest } from '@jest/globals';
import WebSocket from 'ws';
import http from 'http';
import mongoose from 'mongoose';
import { createWebSocketServer } from '../../../config/websocket';
import { CollaborationService } from '../../../services/collaborationService';
import { CollaborationSessionModel } from '../../../models/collaborationSession';
import { diffPatch } from '../../../utils/diffPatch';
import { setupTestEnvironment, teardownTestEnvironment } from '../../../../testing/utils/test-helpers';

const TEST_PORT = 8080;

describe('Real-time Collaboration Integration Tests', () => {
  let server: http.Server;
  let wss: WebSocket.Server;
  let collaborationService: CollaborationService;

  beforeAll(async () => {
    await setupTestEnvironment();
    const result = await setupWebSocketServer();
    server = result.server;
    wss = result.wss;
    collaborationService = new CollaborationService();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
    server.close();
    wss.close();
    await mongoose.connection.close();
  });

  async function setupWebSocketServer(): Promise<{ server: http.Server; wss: WebSocket.Server }> {
    return new Promise((resolve) => {
      const server = http.createServer();
      const wss = createWebSocketServer(server);
      server.listen(TEST_PORT, () => {
        resolve({ server, wss });
      });
    });
  }

  async function createTestClient(url: string): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.on('open', () => resolve(ws));
      ws.on('error', reject);
    });
  }

  test('should establish WebSocket connection', async () => {
    const client = await createTestClient(`ws://localhost:${TEST_PORT}`);
    expect(client.readyState).toBe(WebSocket.OPEN);
    client.close();
  });

  test('should handle real-time collaboration between two clients', async () => {
    const client1 = await createTestClient(`ws://localhost:${TEST_PORT}`);
    const client2 = await createTestClient(`ws://localhost:${TEST_PORT}`);

    const sessionId = 'test-session';
    const initialData = { A1: 'Hello' };

    // Simulate client1 creating a session
    await collaborationService.createSession(sessionId, initialData);

    // Simulate client1 and client2 joining the session
    client1.send(JSON.stringify({ type: 'join', sessionId }));
    client2.send(JSON.stringify({ type: 'join', sessionId }));

    // Simulate client1 making a change
    const change = { A1: 'Hello World' };
    const patch = diffPatch(initialData, change);

    await new Promise<void>((resolve) => {
      client2.on('message', (message: string) => {
        const data = JSON.parse(message);
        expect(data.type).toBe('update');
        expect(data.patch).toEqual(patch);
        resolve();
      });

      client1.send(JSON.stringify({ type: 'update', sessionId, patch }));
    });

    // Verify the session data has been updated
    const session = await CollaborationSessionModel.findOne({ sessionId });
    expect(session?.data).toEqual(change);

    client1.close();
    client2.close();
  });

  test('should handle concurrent edits from multiple clients', async () => {
    const client1 = await createTestClient(`ws://localhost:${TEST_PORT}`);
    const client2 = await createTestClient(`ws://localhost:${TEST_PORT}`);
    const client3 = await createTestClient(`ws://localhost:${TEST_PORT}`);

    const sessionId = 'concurrent-session';
    const initialData = { A1: 'Initial', B1: 'Data' };

    await collaborationService.createSession(sessionId, initialData);

    client1.send(JSON.stringify({ type: 'join', sessionId }));
    client2.send(JSON.stringify({ type: 'join', sessionId }));
    client3.send(JSON.stringify({ type: 'join', sessionId }));

    const changes = [
      { A1: 'Client 1 Edit' },
      { B1: 'Client 2 Edit' },
      { A1: 'Client 3 Edit', C1: 'New Data' }
    ];

    const updatePromises = changes.map((change, index) => {
      const client = [client1, client2, client3][index];
      const patch = diffPatch(initialData, change);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          client.send(JSON.stringify({ type: 'update', sessionId, patch }));
          resolve();
        }, Math.random() * 100); // Simulate slight delay in sending updates
      });
    });

    await Promise.all(updatePromises);

    // Wait for all updates to be processed
    await new Promise((resolve) => setTimeout(resolve, 500));

    const session = await CollaborationSessionModel.findOne({ sessionId });
    expect(session?.data).toEqual({
      A1: 'Client 3 Edit',
      B1: 'Client 2 Edit',
      C1: 'New Data'
    });

    client1.close();
    client2.close();
    client3.close();
  });

  test('should handle client disconnection and reconnection', async () => {
    const client1 = await createTestClient(`ws://localhost:${TEST_PORT}`);
    const sessionId = 'disconnect-session';
    const initialData = { A1: 'Disconnect Test' };

    await collaborationService.createSession(sessionId, initialData);
    client1.send(JSON.stringify({ type: 'join', sessionId }));

    // Simulate disconnection
    client1.close();

    // Simulate reconnection
    const reconnectedClient = await createTestClient(`ws://localhost:${TEST_PORT}`);
    reconnectedClient.send(JSON.stringify({ type: 'join', sessionId }));

    const change = { A1: 'Reconnected and Changed' };
    const patch = diffPatch(initialData, change);

    await new Promise<void>((resolve) => {
      reconnectedClient.on('message', (message: string) => {
        const data = JSON.parse(message);
        if (data.type === 'sync') {
          expect(data.data).toEqual(initialData);
          resolve();
        }
      });
    });

    reconnectedClient.send(JSON.stringify({ type: 'update', sessionId, patch }));

    // Wait for the update to be processed
    await new Promise((resolve) => setTimeout(resolve, 200));

    const session = await CollaborationSessionModel.findOne({ sessionId });
    expect(session?.data).toEqual(change);

    reconnectedClient.close();
  });
});