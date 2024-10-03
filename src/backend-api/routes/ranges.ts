import express from 'express';
import * as rangeController from '../controllers/rangeController';
import { authMiddleware } from '../middleware/auth';
import { validateRange } from '../middleware/validator';
import { apiResponse } from '../utils/apiResponse';

const router = express.Router();

// GET range
router.get(
  '/:workbookId/:worksheetId/:rangeRef',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { workbookId, worksheetId, rangeRef } = req.params;
      const range = await rangeController.getRange(workbookId, worksheetId, rangeRef);
      apiResponse(res, 200, 'Range retrieved successfully', range);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update range
router.put(
  '/:workbookId/:worksheetId/:rangeRef',
  authMiddleware,
  validateRange,
  async (req, res, next) => {
    try {
      const { workbookId, worksheetId, rangeRef } = req.params;
      const updatedRange = await rangeController.updateRange(workbookId, worksheetId, rangeRef, req.body);
      apiResponse(res, 200, 'Range updated successfully', updatedRange);
    } catch (error) {
      next(error);
    }
  }
);

// POST create range
router.post(
  '/:workbookId/:worksheetId/ranges',
  authMiddleware,
  validateRange,
  async (req, res, next) => {
    try {
      const { workbookId, worksheetId } = req.params;
      const newRange = await rangeController.createRange(workbookId, worksheetId, req.body);
      apiResponse(res, 201, 'Range created successfully', newRange);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE range
router.delete(
  '/:workbookId/:worksheetId/:rangeRef',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { workbookId, worksheetId, rangeRef } = req.params;
      await rangeController.deleteRange(workbookId, worksheetId, rangeRef);
      apiResponse(res, 200, 'Range deleted successfully');
    } catch (error) {
      next(error);
    }
  }
);

// GET range values
router.get(
  '/:workbookId/:worksheetId/:rangeRef/values',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { workbookId, worksheetId, rangeRef } = req.params;
      const values = await rangeController.getRangeValues(workbookId, worksheetId, rangeRef);
      apiResponse(res, 200, 'Range values retrieved successfully', values);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update range values
router.put(
  '/:workbookId/:worksheetId/:rangeRef/values',
  authMiddleware,
  validateRange,
  async (req, res, next) => {
    try {
      const { workbookId, worksheetId, rangeRef } = req.params;
      const updatedValues = await rangeController.updateRangeValues(workbookId, worksheetId, rangeRef, req.body);
      apiResponse(res, 200, 'Range values updated successfully', updatedValues);
    } catch (error) {
      next(error);
    }
  }
);

// GET range format
router.get(
  '/:workbookId/:worksheetId/:rangeRef/format',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { workbookId, worksheetId, rangeRef } = req.params;
      const format = await rangeController.getRangeFormat(workbookId, worksheetId, rangeRef);
      apiResponse(res, 200, 'Range format retrieved successfully', format);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update range format
router.put(
  '/:workbookId/:worksheetId/:rangeRef/format',
  authMiddleware,
  validateRange,
  async (req, res, next) => {
    try {
      const { workbookId, worksheetId, rangeRef } = req.params;
      const updatedFormat = await rangeController.updateRangeFormat(workbookId, worksheetId, rangeRef, req.body);
      apiResponse(res, 200, 'Range format updated successfully', updatedFormat);
    } catch (error) {
      next(error);
    }
  }
);

// POST calculate range
router.post(
  '/:workbookId/:worksheetId/:rangeRef/calculate',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { workbookId, worksheetId, rangeRef } = req.params;
      const calculationResult = await rangeController.calculateRange(workbookId, worksheetId, rangeRef);
      apiResponse(res, 200, 'Range calculation completed successfully', calculationResult);
    } catch (error) {
      next(error);
    }
  }
);

export default router;