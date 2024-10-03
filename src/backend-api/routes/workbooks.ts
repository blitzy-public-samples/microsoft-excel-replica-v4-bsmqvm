import { Router } from 'express';
import * as workbookController from '../controllers/workbookController';
import { authMiddleware } from '../middleware/auth';
import { validatorMiddleware } from '../middleware/validator';

const router = Router();

// Create a new workbook
router.post(
  '/',
  authMiddleware,
  validatorMiddleware.validateWorkbookCreation,
  workbookController.createWorkbook
);

// Get all workbooks for the authenticated user
router.get(
  '/',
  authMiddleware,
  workbookController.getAllWorkbooks
);

// Get a specific workbook by ID
router.get(
  '/:id',
  authMiddleware,
  validatorMiddleware.validateWorkbookId,
  workbookController.getWorkbookById
);

// Update a workbook
router.put(
  '/:id',
  authMiddleware,
  validatorMiddleware.validateWorkbookId,
  validatorMiddleware.validateWorkbookUpdate,
  workbookController.updateWorkbook
);

// Delete a workbook
router.delete(
  '/:id',
  authMiddleware,
  validatorMiddleware.validateWorkbookId,
  workbookController.deleteWorkbook
);

// Share a workbook
router.post(
  '/:id/share',
  authMiddleware,
  validatorMiddleware.validateWorkbookId,
  validatorMiddleware.validateWorkbookSharing,
  workbookController.shareWorkbook
);

// List shared workbooks
router.get(
  '/shared',
  authMiddleware,
  workbookController.getSharedWorkbooks
);

export default router;