import express from 'express';
import * as collaborationController from '../controllers/collaborationController';
import { collaborationAuth } from '../middleware/collaborationAuth';

const router = express.Router();

/**
 * Creates and configures the Express router for collaboration routes
 * @returns Configured Express router for collaboration routes
 */
export function collaborationRouter(): express.Router {
  // Initiate a new collaboration session
  router.post('/start', collaborationAuth, collaborationController.startCollaborationSession);

  // Join an existing collaboration session
  router.post('/join', collaborationAuth, collaborationController.joinCollaborationSession);

  // Leave a collaboration session
  router.post('/leave', collaborationAuth, collaborationController.leaveCollaborationSession);

  // Apply a change to the shared workbook
  router.post('/apply-change', collaborationAuth, collaborationController.applyChange);

  // Resolve conflicts during collaborative editing
  router.post('/resolve-conflict', collaborationAuth, collaborationController.resolveConflict);

  // Retrieve collaboration history for a workbook or session
  router.get('/history', collaborationAuth, collaborationController.getCollaborationHistory);

  return router;
}

export default collaborationRouter;