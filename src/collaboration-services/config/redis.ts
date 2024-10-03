import { createClient, RedisClientType } from 'redis';

// Global variables for Redis configuration
export const REDIS_URL: string = process.env.REDIS_URL || 'redis://localhost';
export const REDIS_PORT: number = parseInt(process.env.REDIS_PORT || '6379', 10);

/**
 * Creates and returns a configured Redis client for use in the collaboration services.
 * @returns {Promise<RedisClientType>} A promise that resolves to a configured Redis client
 */
export async function createRedisClient(): Promise<RedisClientType> {
  // Create a new Redis client with the specified configuration options
  const client: RedisClientType = createClient({
    url: `${REDIS_URL}:${REDIS_PORT}`,
    socket: {
      reconnectStrategy: (retries: number) => {
        // Implement a custom retry strategy for handling connection failures
        if (retries > 10) {
          console.error('Redis connection failed after 10 retries. Aborting...');
          return new Error('Redis connection aborted due to too many retries');
        }
        return Math.min(retries * 100, 3000); // Exponential backoff with a maximum of 3 seconds
      },
    },
    // Configure client options
    enableOfflineQueue: true,
    enableReadyCheck: true,
  });

  // Set performance tuning options
  client.commandOptions({
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => Math.min(times * 200, 2000), // Retry with backoff, max 2 seconds
  });

  // Set up event listeners for better error handling and logging
  client.on('error', (err) => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log('Redis Client Connected'));
  client.on('ready', () => console.log('Redis Client Ready'));
  client.on('reconnecting', () => console.log('Redis Client Reconnecting'));

  try {
    // Connect to the Redis server
    await client.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }

  return client;
}

// Export the Redis client creation function as default
export default createRedisClient;