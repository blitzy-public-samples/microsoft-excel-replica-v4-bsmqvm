import express from 'express';
import * as cellController from '../controllers/cellController';
import { authMiddleware } from '../middleware/auth';
import { validateCellInput } from '../middleware/validator';

const router = express.Router();

/**
 * @route GET /api/cells/:id
 * @desc Retrieves the value of a specific cell
 * @access Private
 */
router.get('/:id', authMiddleware, cellController.getCellValue);

/**
 * @route PUT /api/cells/:id
 * @desc Updates the value of a specific cell
 * @access Private
 */
router.put('/:id', authMiddleware, validateCellInput, cellController.updateCellValue);

/**
 * @route GET /api/cells/:id/formula
 * @desc Retrieves the formula of a specific cell
 * @access Private
 */
router.get('/:id/formula', authMiddleware, cellController.getCellFormula);

/**
 * @route PUT /api/cells/:id/formula
 * @desc Updates the formula of a specific cell
 * @access Private
 */
router.put('/:id/formula', authMiddleware, validateCellInput, cellController.updateCellFormula);

/**
 * @route GET /api/cells/:id/formatting
 * @desc Retrieves the formatting of a specific cell
 * @access Private
 */
router.get('/:id/formatting', authMiddleware, cellController.getCellFormatting);

/**
 * @route PUT /api/cells/:id/formatting
 * @desc Updates the formatting of a specific cell
 * @access Private
 */
router.put('/:id/formatting', authMiddleware, validateCellInput, cellController.updateCellFormatting);

export default router;