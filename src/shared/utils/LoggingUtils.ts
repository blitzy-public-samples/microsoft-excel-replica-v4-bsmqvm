import winston from 'winston';
import { AppConfig } from '../config/AppConfig';
import { ILogger } from '../interfaces/ILogger';

// Define the LoggerOptions type
type LoggerOptions = {
  level?: string;
  format?: winston.Logform.Format;
  transports?: winston.transport[];
};

/**
 * Creates and returns a winston Logger instance with predefined settings and custom options.
 * @param options Custom options for the logger
 * @returns A configured winston Logger instance
 */
export function createLogger(options?: LoggerOptions): winston.Logger {
  const defaultOptions: LoggerOptions = {
    level: AppConfig.logging.level || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'excel.log' })
    ]
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return winston.createLogger(mergedOptions);
}

// Create a default logger instance
const defaultLogger = createLogger();

/**
 * A utility function to log messages using the default logger instance.
 * @param level The log level
 * @param message The message to log
 * @param meta Additional metadata to log
 */
export function log(level: string, message: string, meta?: any): void {
  if (!defaultLogger) {
    defaultLogger = createLogger();
  }
  defaultLogger.log(level, message, meta);
}

/**
 * A class that implements the ILogger interface and provides logging functionality using winston.
 */
export class Logger implements ILogger {
  private logger: winston.Logger;

  /**
   * Initializes a new instance of the Logger class.
   * @param options Custom options for the logger
   */
  constructor(options?: LoggerOptions) {
    this.logger = createLogger(options);
  }

  /**
   * Logs an info level message.
   * @param message The message to log
   * @param meta Additional metadata to log
   */
  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Logs an error level message.
   * @param message The message to log
   * @param meta Additional metadata to log
   */
  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  /**
   * Logs a warning level message.
   * @param message The message to log
   * @param meta Additional metadata to log
   */
  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Logs a debug level message.
   * @param message The message to log
   * @param meta Additional metadata to log
   */
  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }
}

export default {
  createLogger,
  log,
  Logger
};