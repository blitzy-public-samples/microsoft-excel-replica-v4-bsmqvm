import express from 'express';
import { presenceController } from '../controllers/presenceController';
import { collaborationAuth } from '../middleware/collaborationAuth';

const presenceRouter = express.Router();

/**
 * This function creates and configures an Express router for handling user presence-related routes.
 * It defines the endpoints and associates them with the appropriate controller functions and middleware.
 * @returns {express.Router} Configured Express router for presence routes
 */
function createPresenceRouter(): express.Router {
  // POST /update route with collaborationAuth middleware and presenceController.updatePresence handler
  presenceRouter.post('/update', collaborationAuth, presenceController.updatePresence);

  // GET /users route with collaborationAuth middleware and presenceController.getActiveUsers handler
  presenceRouter.get('/users', collaborationAuth, presenceController.getActiveUsers);

  // POST /heartbeat route with collaborationAuth middleware and presenceController.sendHeartbeat handler
  presenceRouter.post('/heartbeat', collaborationAuth, presenceController.sendHeartbeat);

  // DELETE /remove route with collaborationAuth middleware and presenceController.removePresence handler
  presenceRouter.delete('/remove', collaborationAuth, presenceController.removePresence);

  return presenceRouter;
}

export default createPresenceRouter();