import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import router from './routes';
import authConfig from './config/auth';
import corsConfig from './config/cors';
import dbConfig from './config/database';
import rateLimitConfig from './config/rateLimit';
import errorHandler from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';

const app: Express = express();

// Configure middleware
const configureMiddleware = (app: Express): void => {
  // Apply CORS middleware with corsConfig
  app.use(cors(corsConfig));

  // Apply helmet middleware for security headers
  app.use(helmet());

  // Apply compression middleware
  app.use(compression());

  // Configure express to parse JSON and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Apply morgan middleware for request logging
  app.use(morgan('combined'));

  // Apply rate limiter middleware with rateLimitConfig
  app.use(rateLimiter(rateLimitConfig));
};

// Configure routes
const configureRoutes = (app: Express): void => {
  // Mount the main router at the '/api' path
  app.use('/api', router);
};

// Initialize the application
const initializeApp = (): Express => {
  // Configure middleware
  configureMiddleware(app);

  // Configure routes
  configureRoutes(app);

  // Apply global error handling middleware
  app.use(errorHandler);

  return app;
};

// Initialize the database connection
dbConfig.initialize();

// Initialize authentication
authConfig.initialize();

// Export the initialized app
export default initializeApp();