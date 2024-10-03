import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { AuthConfig } from '../config/auth';
import { ApiResponse } from '../utils/apiResponse';
import { Logger } from '../utils/logger';

// Assuming AuthConfig interface
interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  verifyToken: (token: string) => Promise<any>;
}

// Assuming ApiResponse interface
interface ApiResponse {
  createErrorResponse: (status: number, message: string) => any;
}

// Assuming Logger interface
interface Logger {
  info: (message: string, meta?: any) => void;
  error: (message: string, meta?: any) => void;
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    AuthConfig.verifyToken(token)
      .then((user) => {
        req.user = user;
        Logger.info('Authentication successful', { userId: user.id });
        next();
      })
      .catch((error) => {
        Logger.error('Authentication failed', { error: error.message });
        const errorResponse = ApiResponse.createErrorResponse(401, 'Unauthorized');
        res.status(401).json(errorResponse);
      });
  } else {
    Logger.error('Authentication failed', { error: 'No token provided' });
    const errorResponse = ApiResponse.createErrorResponse(401, 'Unauthorized');
    res.status(401).json(errorResponse);
  }
};

const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      Logger.error('Authorization failed', { error: 'User not authenticated' });
      const errorResponse = ApiResponse.createErrorResponse(401, 'Unauthorized');
      return res.status(401).json(errorResponse);
    }

    const userRoles = (req.user as any).roles || [];
    const hasAuthorizedRole = roles.some(role => userRoles.includes(role));

    if (hasAuthorizedRole) {
      Logger.info('Authorization successful', { userId: (req.user as any).id, roles: userRoles });
      next();
    } else {
      Logger.error('Authorization failed', { userId: (req.user as any).id, requiredRoles: roles, userRoles });
      const errorResponse = ApiResponse.createErrorResponse(403, 'Forbidden');
      res.status(403).json(errorResponse);
    }
  };
};

// Configure Passport JWT strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AuthConfig.jwtSecret,
    },
    (jwtPayload, done) => {
      // You can add additional user verification logic here if needed
      return done(null, jwtPayload);
    }
  )
);

export { authenticateJWT, authorizeRoles };