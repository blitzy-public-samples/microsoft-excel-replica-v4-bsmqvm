import { Response } from 'express';
import { logger } from './logger';

interface SuccessResponse {
  success: true;
  data: any;
  message?: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

/**
 * Creates a standardized success response for the API.
 * @param res - Express Response object
 * @param data - Data to be sent in the response
 * @param statusCode - HTTP status code (default: 200)
 * @param message - Optional success message
 */
export function createSuccessResponse(res: Response, data: any, statusCode: number = 200, message?: string): void {
  const response: SuccessResponse = {
    success: true,
    data,
    message
  };

  res.status(statusCode).json(response);

  // Log the response
  logger.info('API Success Response', {
    statusCode,
    data,
    message
  });
}

/**
 * Creates a standardized error response for the API.
 * @param res - Express Response object
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 * @param errors - Optional additional error details
 */
export function createErrorResponse(res: Response, message: string, statusCode: number = 500, errors?: any): void {
  const response: ErrorResponse = {
    success: false,
    message,
    errors
  };

  res.status(statusCode).json(response);

  // Log the error response
  logger.error('API Error Response', {
    statusCode,
    message,
    errors
  });
}

// Export the response interfaces for use in other parts of the application
export type { SuccessResponse, ErrorResponse };