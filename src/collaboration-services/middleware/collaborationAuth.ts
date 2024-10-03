import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationService } from '../services/authenticationService';
import { CollaborationService } from '../services/collaborationService';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    // Add other user properties as needed
  };
}

export const collaborationAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract the JWT token from the request headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // Verify the JWT token using the AuthenticationService
    const authService = new AuthenticationService();
    const decodedToken = await authService.verifyToken(token);

    if (!decodedToken) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Extract the user ID and collaboration session ID from the request
    const userId = decodedToken.userId;
    const collaborationSessionId = req.params.sessionId || req.body.sessionId;

    if (!userId || !collaborationSessionId) {
      res.status(400).json({ error: 'Missing user ID or collaboration session ID' });
      return;
    }

    // Use the CollaborationService to verify the user's access to the requested collaboration session
    const collaborationService = new CollaborationService();
    const hasAccess = await collaborationService.verifyUserAccess(userId, collaborationSessionId);

    if (!hasAccess) {
      res.status(403).json({ error: 'User does not have access to this collaboration session' });
      return;
    }

    // If authentication and authorization are successful, attach the user information to the request object
    req.user = {
      id: userId,
      // Add other user properties as needed
    };

    // Call the next middleware
    next();
  } catch (error) {
    console.error('Collaboration authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the middleware function
export default collaborationAuth;