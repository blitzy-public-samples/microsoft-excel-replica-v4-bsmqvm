import express from 'express';
import * as chartController from '../controllers/chartController';
import * as authMiddleware from '../middleware/auth';
import { validateChart } from '../middleware/validator';

const router = express.Router();

/**
 * @route POST /charts
 * @description Creates a new chart
 * @access Private
 */
router.post(
  '/',
  authMiddleware.authenticate,
  validateChart,
  chartController.createChart
);

/**
 * @route GET /charts/:id
 * @description Retrieves a specific chart by ID
 * @access Private
 */
router.get(
  '/:id',
  authMiddleware.authenticate,
  chartController.getChart
);

/**
 * @route PUT /charts/:id
 * @description Updates an existing chart
 * @access Private
 */
router.put(
  '/:id',
  authMiddleware.authenticate,
  validateChart,
  chartController.updateChart
);

/**
 * @route DELETE /charts/:id
 * @description Deletes a specific chart
 * @access Private
 */
router.delete(
  '/:id',
  authMiddleware.authenticate,
  chartController.deleteChart
);

/**
 * @route GET /charts
 * @description Retrieves all charts for a workbook or worksheet
 * @access Private
 */
router.get(
  '/',
  authMiddleware.authenticate,
  chartController.getAllCharts
);

export default router;