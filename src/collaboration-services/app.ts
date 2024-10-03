import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createRedisClient } from './config/redis';
import { createWebSocketServer } from './config/websocket';
import { collaborationAuth } from './middleware/collaborationAuth';
import { websocketHandler } from './middleware/websocketHandler';
import collaborationRoutes from './routes/collaboration';
import presenceRoutes from './routes/presence';
import versionControlRoutes from './routes/versionControl';

// Create Express application
const app: Express = express();

// Configure middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Set various HTTP headers for app security
app.use(morgan('combined')); // HTTP request logging
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Custom authentication middleware
app.use(collaborationAuth);

// Set up routes
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/presence', presenceRoutes);
app.use('/api/version-control', versionControlRoutes);

// Create and attach WebSocket server
const wss = createWebSocketServer(app);
wss.on('connection', websocketHandler);

// Create Redis client
const redisClient = createRedisClient();

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Implement rate limiting
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

// Configure input validation and sanitization
const { body, validationResult } = require('express-validator');
app.use(body().trim().escape());

// Set up secure session management
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

export default app;