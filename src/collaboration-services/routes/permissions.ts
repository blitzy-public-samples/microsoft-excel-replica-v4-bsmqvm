import express from 'express';
import * as permissionController from '../controllers/permissionController';
import { collaborationAuth } from '../middleware/collaborationAuth';

const permissionRouter = express.Router();

// Apply collaborationAuth middleware to all routes
permissionRouter.use(collaborationAuth);

// GET route for retrieving permissions for a specific workbook
permissionRouter.get(
  '/api/permissions/:workbookId',
  permissionController.getWorkbookPermissions
);

// POST route for adding or updating permissions for a specific workbook
permissionRouter.post(
  '/api/permissions/:workbookId',
  permissionController.updateWorkbookPermissions
);

// DELETE route for removing a user's permissions from a specific workbook
permissionRouter.delete(
  '/api/permissions/:workbookId/:userId',
  permissionController.removeUserPermissions
);

// GET route for retrieving all users with permissions for a specific workbook
permissionRouter.get(
  '/api/permissions/:workbookId/users',
  permissionController.getWorkbookUsers
);

// POST route for sharing a workbook with other users
permissionRouter.post(
  '/api/permissions/:workbookId/share',
  permissionController.shareWorkbook
);

export default permissionRouter;