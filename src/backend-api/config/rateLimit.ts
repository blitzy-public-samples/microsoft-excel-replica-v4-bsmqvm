import { RateLimitOptions } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';

// Global constants for rate limiting
export const RATE_LIMIT_WINDOW_MS: number = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS: number = 100; // 100 requests per window
export const RATE_LIMIT_MESSAGE: string = 'Too many requests, please try again later.';

// Interface for custom rate limit options
interface CustomRateLimitOptions extends Partial<RateLimitOptions> {
  redisEnabled?: boolean;
}

/**
 * Creates and configures a rate limiter middleware based on the provided options or default settings.
 * @param options Custom rate limit options
 * @returns Configured rate limiter middleware
 */
export function createRateLimiter(options?: CustomRateLimitOptions): RateLimitOptions {
  const defaultOptions: RateLimitOptions = {
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    message: RATE_LIMIT_MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  if (options?.redisEnabled) {
    const store = configureRedisStore();
    if (store) {
      mergedOptions.store = store;
    }
  }

  return mergedOptions;
}

/**
 * Configures and returns a Redis store for distributed rate limiting if Redis is enabled in the environment.
 * @returns Configured Redis store or undefined if not enabled
 */
function configureRedisStore(): RedisStore | undefined {
  if (process.env.REDIS_ENABLED === 'true') {
    const redisClient = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    return new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    });
  }

  return undefined;
}

export default createRateLimiter;