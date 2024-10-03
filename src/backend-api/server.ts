import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import logger from './utils/logger';
import config from './config';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

function normalizePort(val: string): number | string | boolean {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  logger.info(`Server listening on ${bind}`);
}

function startServer(): void {
  const port = normalizePort(PORT.toString());
  app.set('port', port);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  logger.info(`Server started in ${process.env.NODE_ENV} mode`);
}

startServer();

export default server;