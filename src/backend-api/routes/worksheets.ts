import express from 'express';
import * as worksheetController from '../controllers/worksheetController';
import { authMiddleware } from '../middleware/auth';
import { validateWorksheet } from '../middleware/validator';

const router = express.Router();

/**
 * @route GET /api/v1/workbooks/:workbookId/worksheets
 * @desc Get all worksheets for a workbook
 * @access Private
 */
router.get(
  '/:workbookId/worksheets',
  authMiddleware,
  worksheetController.getAllWorksheets
);

/**
 * @route POST /api/v1/workbooks/:workbookId/worksheets
 * @desc Create a new worksheet in a workbook
 * @access Private
 */
router.post(
  '/:workbookId/worksheets',
  authMiddleware,
  validateWorksheet,
  worksheetController.createWorksheet
);

/**
 * @route GET /api/v1/workbooks/:workbookId/worksheets/:worksheetId
 * @desc Get a specific worksheet by ID
 * @access Private
 */
router.get(
  '/:workbookId/worksheets/:worksheetId',
  authMiddleware,
  worksheetController.getWorksheetById
);

/**
 * @route PUT /api/v1/workbooks/:workbookId/worksheets/:worksheetId
 * @desc Update a specific worksheet
 * @access Private
 */
router.put(
  '/:workbookId/worksheets/:worksheetId',
  authMiddleware,
  validateWorksheet,
  worksheetController.updateWorksheet
);

/**
 * @route DELETE /api/v1/workbooks/:workbookId/worksheets/:worksheetId
 * @desc Delete a specific worksheet
 * @access Private
 */
router.delete(
  '/:workbookId/worksheets/:worksheetId',
  authMiddleware,
  worksheetController.deleteWorksheet
);

/**
 * @route PATCH /api/v1/workbooks/:workbookId/worksheets/:worksheetId/rename
 * @desc Rename a specific worksheet
 * @access Private
 */
router.patch(
  '/:workbookId/worksheets/:worksheetId/rename',
  authMiddleware,
  validateWorksheet,
  worksheetController.renameWorksheet
);

/**
 * @route PATCH /api/v1/workbooks/:workbookId/worksheets/:worksheetId/reorder
 * @desc Reorder a specific worksheet
 * @access Private
 */
router.patch(
  '/:workbookId/worksheets/:worksheetId/reorder',
  authMiddleware,
  validateWorksheet,
  worksheetController.reorderWorksheet
);

export default router;