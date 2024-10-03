import { Request, Response, NextFunction } from 'express';
import { CollaborationService } from '../services/collaborationService';
import { CollaborationSession } from '../models/collaborationSession';
import { diffPatch } from '../utils/diffPatch';
import { resolveConflict } from '../utils/conflictResolution';
import { collaborationAuth } from '../middleware/collaborationAuth';
import { HttpStatus } from 'http-status-codes';

class CollaborationController {
  private collaborationService: CollaborationService;

  constructor(collaborationService: CollaborationService) {
    this.collaborationService = collaborationService;
  }

  public startCollaborationSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { workbookId, userId } = req.body;
      const session = await this.collaborationService.createCollaborationSession(workbookId, userId);
      res.status(HttpStatus.CREATED).json(session);
    } catch (error) {
      next(error);
    }
  };

  public joinCollaborationSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId, userId } = req.body;
      await this.collaborationService.joinCollaborationSession(sessionId, userId);
      res.status(HttpStatus.OK).json({ message: 'Successfully joined the collaboration session' });
    } catch (error) {
      next(error);
    }
  };

  public leaveCollaborationSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId, userId } = req.body;
      await this.collaborationService.leaveCollaborationSession(sessionId, userId);
      res.status(HttpStatus.OK).json({ message: 'Successfully left the collaboration session' });
    } catch (error) {
      next(error);
    }
  };

  public applyChange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId, userId, changes } = req.body;
      await this.collaborationService.applyChanges(sessionId, userId, changes);
      res.status(HttpStatus.OK).json({ message: 'Changes applied successfully' });
    } catch (error) {
      next(error);
    }
  };

  public resolveConflict = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId, conflictDetails } = req.body;
      const resolvedChanges = resolveConflict(conflictDetails);
      await this.collaborationService.applyChanges(sessionId, 'system', resolvedChanges);
      res.status(HttpStatus.OK).json({ message: 'Conflict resolved successfully', resolvedState: resolvedChanges });
    } catch (error) {
      next(error);
    }
  };

  public getCollaborationHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { workbookId, sessionId } = req.query;
      const history = await this.collaborationService.getCollaborationHistory(workbookId as string, sessionId as string);
      res.status(HttpStatus.OK).json(history);
    } catch (error) {
      next(error);
    }
  };
}

export default CollaborationController;

// Human tasks:
// 1. Implement error handling middleware to catch and format errors properly
// 2. Add input validation for request parameters
// 3. Implement rate limiting to prevent abuse of the collaboration API
// 4. Add logging for important events and errors
// 5. Implement proper authentication and authorization checks
// 6. Add unit tests for each controller method
// 7. Implement WebSocket support for real-time updates
// 8. Add documentation for the API endpoints