import express from 'express';
import { commentController } from '../controllers/commentController';
import { AuthMiddleware } from '../middleware/auth';
import { ValidatorMiddleware } from '../middleware/validator';

const router = express.Router();

// POST /api/comments
router.post(
  '/',
  AuthMiddleware.authenticate,
  ValidatorMiddleware.validateCommentCreate,
  commentController.createComment
);

// GET /api/comments
router.get(
  '/',
  AuthMiddleware.authenticate,
  ValidatorMiddleware.validateCommentGet,
  commentController.getComments
);

// PUT /api/comments/:id
router.put(
  '/:id',
  AuthMiddleware.authenticate,
  ValidatorMiddleware.validateCommentUpdate,
  commentController.updateComment
);

// DELETE /api/comments/:id
router.delete(
  '/:id',
  AuthMiddleware.authenticate,
  ValidatorMiddleware.validateCommentDelete,
  commentController.deleteComment
);

export default router;