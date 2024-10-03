import express from 'express';
import cellsRouter from './cells';
import chartsRouter from './charts';
import commentsRouter from './comments';
import rangesRouter from './ranges';
import workbooksRouter from './workbooks';
import worksheetsRouter from './worksheets';

// Create the main router
const router = express.Router();

// Mount the individual route modules
router.use('/cells', cellsRouter);
router.use('/charts', chartsRouter);
router.use('/comments', commentsRouter);
router.use('/ranges', rangesRouter);
router.use('/workbooks', workbooksRouter);
router.use('/worksheets', worksheetsRouter);

// Export the main router
export default router;

// Human tasks:
// 1. Implement error handling middleware
// 2. Add authentication middleware
// 3. Implement rate limiting
// 4. Add logging for all API requests
// 5. Implement CORS configuration
// 6. Add API versioning
// 7. Implement request validation middleware