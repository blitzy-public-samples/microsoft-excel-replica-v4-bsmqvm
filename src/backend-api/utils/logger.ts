import winston from 'winston';

// Configure logger settings
const loggerConfig = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  },
};

// Create and configure the Winston logger instance
const createLogger = (): winston.Logger => {
  // Add colors to Winston console logs
  winston.addColors(loggerConfig.colors);

  // Define the format for log messages
  const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  );

  // Define which transports the logger must use
  const transports = [
    // Console transport for development environment
    new winston.transports.Console({
      format,
    }),
    // File transport for production environment
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.json()
      ),
    }),
  ];

  // Create and return the winston Logger instance
  return winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels: loggerConfig.levels,
    format,
    transports,
  });
};

// Create the logger instance
const logger = createLogger();

// Export the logger as a global variable
export { logger };

// Export the createLogger function for testing purposes
export { createLogger };