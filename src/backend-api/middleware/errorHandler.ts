import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { Logger } from '../utils/logger';

/**
 * Error handling middleware for the backend API of Microsoft Excel.
 * This middleware catches and processes errors that occur during API request handling,
 * providing a consistent error response format and logging error details for debugging and monitoring purposes.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  // Determine the error type and appropriate status code
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || 'Internal Server Error';

  // Sanitize error message for production environment
  if (process.env.NODE_ENV === 'production') {
    errorMessage = statusCode === 500 ? 'Internal Server Error' : errorMessage;
  }

  // Log error details using the Logger utility
  Logger.error(`Error: ${errorMessage}`, {
    statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id, // Assuming request ID middleware is used
  });

  // Create a standardized error response using ApiResponse.createErrorResponse
  const errorResponse = ApiResponse.createErrorResponse(statusCode, errorMessage);

  // Send the error response to the client
  res.status(statusCode).json(errorResponse);
};

/**
 * Wrapper function to catch async errors and pass them to the error handler
 */
export const asyncErrorHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};