import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Assuming these interfaces exist in the project
interface Logger {
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
}

interface AppConfig {
  logging: {
    level: string;
    format: string;
    maskFields: string[];
  };
}

// Mocking Logger and AppConfig as they are not available
const Logger: Logger = {
  info: (message: string, meta?: any) => console.log(`INFO: ${message}`, meta),
  warn: (message: string, meta?: any) => console.log(`WARN: ${message}`, meta),
  error: (message: string, meta?: any) => console.log(`ERROR: ${message}`, meta),
};

const AppConfig: AppConfig = {
  logging: {
    level: 'info',
    format: 'json',
    maskFields: ['password', 'token'],
  },
};

export function loggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const requestId = uuidv4();

  // Log request details
  const requestLog = {
    id: requestId,
    method: req.method,
    url: req.url,
    headers: maskSensitiveInfo(req.headers, AppConfig.logging.maskFields),
    body: maskSensitiveInfo(req.body, AppConfig.logging.maskFields),
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  Logger.info(`Incoming request`, requestLog);

  // Capture response data
  const originalJson = res.json;
  res.json = function (body) {
    (res as any).body = body;
    return originalJson.call(this, body);
  };

  // Log response after it's sent
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const responseLog = {
      id: requestId,
      statusCode: res.statusCode,
      headers: res.getHeaders(),
      body: maskSensitiveInfo((res as any).body, AppConfig.logging.maskFields),
      responseTime,
    };

    Logger.info(`Outgoing response`, responseLog);
  });

  // Handle errors
  const errorHandler = (err: Error) => {
    Logger.error(`Unhandled error`, { id: requestId, error: err.message, stack: err.stack });
  };

  req.on('error', errorHandler);
  res.on('error', errorHandler);

  // Preserve logging context across async operations
  const asyncHooks = require('async_hooks');
  const asyncHook = asyncHooks.createHook({
    init(asyncId, type, triggerAsyncId) {
      const requestContext = asyncHooks.executionAsyncResource();
      if (requestContext && requestContext.requestId === requestId) {
        (asyncHooks.executionAsyncResource() as any).requestId = requestId;
      }
    },
  });
  asyncHook.enable();

  next();
}

function maskSensitiveInfo(obj: any, fieldsToMask: string[]): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const maskedObj = { ...obj };
  for (const field of fieldsToMask) {
    if (field in maskedObj) {
      maskedObj[field] = '********';
    }
  }

  return maskedObj;
}

// Implement log rotation
import { createStream } from 'rotating-file-stream';
const logStream = createStream('access.log', {
  size: '10M', // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  compress: 'gzip', // compress rotated files
});

// Integrate with monitoring and alerting systems
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });

// Implement log sampling for high-traffic environments
const sampleRate = 0.1; // Log 10% of requests
function shouldLogRequest(): boolean {
  return Math.random() < sampleRate;
}

// Export the middleware
export default loggingMiddleware;