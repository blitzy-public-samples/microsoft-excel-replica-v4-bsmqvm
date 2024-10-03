import { Request, Response, NextFunction } from 'express';
import { handleError, ExcelError, isExcelError } from '../utils/ErrorHandlingUtils';
import { ErrorCodes } from '../constants/ErrorCodes';
import { Logger } from '../utils/LoggingUtils';
import { AppConfig } from '../config/AppConfig';

/**
 * Error handling middleware for Express.js applications in Microsoft Excel.
 * This middleware catches and processes errors that occur during the request-response cycle.
 * 
 * @param err - The error object caught by Express
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function in the Express pipeline
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let excelError: ExcelError;
  let statusCode: number;

  // Check if the error is an instance of ExcelError
  if (isExcelError(err)) {
    excelError = err;
    statusCode = getStatusCodeForExcelError(excelError.code);
  } else {
    // If it's not an ExcelError, create a generic one
    excelError = new ExcelError(ErrorCodes.INTERNAL_SERVER_ERROR, err.message);
    statusCode = 500;
  }

  // Log the error
  Logger.error('Error occurred:', {
    errorCode: excelError.code,
    errorMessage: excelError.message,
    stackTrace: err.stack
  });

  // Determine how much information to send to the client based on the environment
  const errorResponse = createErrorResponse(excelError);

  // Send the error response
  res.status(statusCode).json(errorResponse);

  // Call next() to ensure that Express knows we've handled the error
  next();
};

/**
 * Determines the appropriate HTTP status code based on the Excel error code.
 * 
 * @param errorCode - The Excel-specific error code
 * @returns The corresponding HTTP status code
 */
function getStatusCodeForExcelError(errorCode: string): number {
  // This is a simplified mapping. In a real implementation, you would have a more comprehensive mapping.
  switch (errorCode) {
    case ErrorCodes.BAD_REQUEST:
      return 400;
    case ErrorCodes.UNAUTHORIZED:
      return 401;
    case ErrorCodes.FORBIDDEN:
      return 403;
    case ErrorCodes.NOT_FOUND:
      return 404;
    default:
      return 500;
  }
}

/**
 * Creates an error response object based on the environment configuration.
 * 
 * @param error - The ExcelError object
 * @returns An object containing the error details to be sent to the client
 */
function createErrorResponse(error: ExcelError): object {
  const baseResponse = {
    error: {
      code: error.code,
      message: error.message
    }
  };

  // In development, we might want to include more details
  if (AppConfig.isDevelopment()) {
    return {
      ...baseResponse,
      stackTrace: error.stack
    };
  }

  return baseResponse;
}

// Export the error middleware for use in the main application
export default errorMiddleware;