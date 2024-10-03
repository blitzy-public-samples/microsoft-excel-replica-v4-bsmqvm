import WebSocket from 'ws';
import http from 'http';
import { CollaborationService } from '../services/collaborationService';
import { PresenceService } from '../services/presenceService';
import { ErrorHandlingUtils } from '../../shared/utils/ErrorHandlingUtils';
import { LoggingUtils } from '../../shared/utils/LoggingUtils';

// Basic WebSocket configuration
const WebSocketConfig = {
    port: 8080,
    path: '/ws'
};

export class WebSocketHandler {
    private wss: WebSocket.Server;
    private collaborationService: CollaborationService;
    private presenceService: PresenceService;

    constructor(server: http.Server) {
        this.wss = new WebSocket.Server({ server, path: WebSocketConfig.path });
        this.collaborationService = new CollaborationService();
        this.presenceService = new PresenceService();
        this.init();
    }

    private init(): void {
        this.wss.on('connection', this.handleConnection.bind(this));
        LoggingUtils.info('WebSocket server initialized');
    }

    private handleConnection(ws: WebSocket, req: http.IncomingMessage): void {
        LoggingUtils.info('New WebSocket connection');

        // Authenticate the user (assuming authentication middleware has been applied)
        const userId = req.headers['user-id'] as string;
        if (!userId) {
            ws.close(1008, 'Authentication failed');
            return;
        }

        // Set up event listeners
        ws.on('message', (message: WebSocket.Data) => this.handleMessage(ws, message, userId));
        ws.on('close', () => this.handleDisconnection(userId));
        ws.on('error', (error: Error) => this.handleError(error, userId));

        // Add user to collaboration session
        this.presenceService.addUser(userId);
        LoggingUtils.info(`User ${userId} connected`);
    }

    private handleMessage(ws: WebSocket, message: WebSocket.Data, userId: string): void {
        try {
            const parsedMessage = JSON.parse(message.toString());
            LoggingUtils.debug(`Received message from user ${userId}:`, parsedMessage);

            switch (parsedMessage.type) {
                case 'COLLABORATION_UPDATE':
                    this.collaborationService.handleUpdate(parsedMessage.data);
                    this.broadcastUpdate(parsedMessage, userId);
                    break;
                case 'PRESENCE_UPDATE':
                    this.presenceService.updateUserStatus(userId, parsedMessage.data);
                    this.broadcastPresence(parsedMessage, userId);
                    break;
                default:
                    LoggingUtils.warn(`Unknown message type received from user ${userId}`);
            }
        } catch (error) {
            ErrorHandlingUtils.handleError(error);
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid message format' }));
        }
    }

    private handleDisconnection(userId: string): void {
        this.presenceService.removeUser(userId);
        LoggingUtils.info(`User ${userId} disconnected`);
    }

    private handleError(error: Error, userId: string): void {
        ErrorHandlingUtils.handleError(error);
        LoggingUtils.error(`WebSocket error for user ${userId}:`, error);
    }

    private broadcastUpdate(message: any, senderId: string): void {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client !== this.wss.clients[senderId]) {
                client.send(JSON.stringify(message));
            }
        });
    }

    private broadcastPresence(message: any, senderId: string): void {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client !== this.wss.clients[senderId]) {
                client.send(JSON.stringify(message));
            }
        });
    }
}

export function handleWebSocket(server: http.Server): void {
    new WebSocketHandler(server);
    LoggingUtils.info('WebSocket handler initialized');
}