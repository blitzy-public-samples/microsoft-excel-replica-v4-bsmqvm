import { Request, Response, NextFunction } from 'express';
import { createRateLimiter } from '../config/rateLimit';
import { logger } from '../utils/logger';

/**
 * Rate limiter middleware for the Microsoft Excel backend API.
 * This middleware applies rate limiting to incoming requests to protect the API from abuse and ensure fair usage.
 * 
 * @returns {express.RequestHandler} Configured rate limiter middleware
 */
export const rateLimiterMiddleware = (): express.RequestHandler => {
  const limiter = createRateLimiter();

  return (req: Request, res: Response, next: NextFunction) => {
    limiter(req, res, (err: any) => {
      if (err) {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
          error: 'Too many requests, please try again later.',
          retryAfter: err.resetTime ? Math.ceil((err.resetTime - Date.now()) / 1000) : undefined
        });
      } else {
        next();
      }
    });
  };
};

/**
 * Apply rate limiter middleware to a specific route or router
 * 
 * @param {express.Router | express.Application} router - The Express router or application to apply the rate limiter to
 * @returns {void}
 */
export const applyRateLimiter = (router: express.Router | express.Application): void => {
  router.use(rateLimiterMiddleware());
};