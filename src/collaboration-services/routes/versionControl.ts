import express from 'express';
import { VersionControlController } from '../controllers/versionControlController';
import { collaborationAuth } from '../middleware/collaborationAuth';

const router = express.Router();

/**
 * Version Control Routes
 * These routes handle version control-related operations for collaborative workbooks.
 */

/**
 * @route POST /api/versions
 * @desc Creates a new version of a workbook
 * @access Private
 */
router.post('/', collaborationAuth, VersionControlController.createVersion);

/**
 * @route GET /api/versions/:workbookId
 * @desc Retrieves the version history of a specific workbook
 * @access Private
 */
router.get('/:workbookId', collaborationAuth, VersionControlController.getVersionHistory);

/**
 * @route POST /api/versions/:workbookId/revert
 * @desc Reverts a workbook to a specific version
 * @access Private
 */
router.post('/:workbookId/revert', collaborationAuth, VersionControlController.revertToVersion);

/**
 * @route GET /api/versions/:workbookId/compare
 * @desc Compares two versions of a workbook
 * @access Private
 */
router.get('/:workbookId/compare', collaborationAuth, VersionControlController.compareVersions);

/**
 * @route POST /api/versions/:workbookId/merge
 * @desc Merges changes from one version into another
 * @access Private
 */
router.post('/:workbookId/merge', collaborationAuth, VersionControlController.mergeVersions);

// Error handling middleware
router.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

export default router;