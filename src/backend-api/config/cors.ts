import cors, { CorsOptions } from 'cors';
import { Request, Response, NextFunction } from 'express';

/**
 * Configures Cross-Origin Resource Sharing (CORS) settings for the Microsoft Excel backend API.
 * This function returns the CORS configuration options for use in the Express application.
 * 
 * @returns {CorsOptions} CORS configuration options
 */
export function configureCors(): CorsOptions {
  const allowedOrigins = [
    'https://excel.microsoft.com',
    'https://excel-web.microsoft.com',
    'https://excel-desktop.microsoft.com',
    'https://excel-mobile.microsoft.com'
  ];

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Excel-Version',
      'X-Excel-Client'
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204
  };

  return corsOptions;
}

/**
 * Custom error handler for CORS-related issues.
 * This middleware function handles CORS errors and sends an appropriate response.
 * 
 * @param {Error} err - The error object
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {NextFunction} next - The next middleware function
 */
export function corsErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: 'CORS Error',
      message: 'The request origin is not allowed by CORS policy.'
    });
  } else {
    next(err);
  }
}

/**
 * Applies CORS configuration to the Express application.
 * This function should be called in the main application file to enable CORS.
 * 
 * @param {Express.Application} app - The Express application instance
 */
export function applyCorsConfig(app: Express.Application): void {
  const corsOptions = configureCors();
  app.use(cors(corsOptions));
  app.use(corsErrorHandler);
}