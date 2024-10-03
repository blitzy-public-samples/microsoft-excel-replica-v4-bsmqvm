import { Request, Response } from 'express';
import { commentService } from '../services/commentService';
import { ApiResponse } from '../utils/apiResponse';
import { validateComment } from '../utils/validation';
import { AuthMiddleware } from '../middleware/auth';

export class CommentController {
  /**
   * Handles the creation of a new comment.
   * @param req - The request object
   * @param res - The response object
   */
  public static async createComment(req: Request, res: Response): Promise<void> {
    try {
      const commentData = req.body;
      const validatedData = validateComment(commentData);
      
      if (!validatedData.isValid) {
        ApiResponse.error(res, 400, 'Invalid comment data', validatedData.errors);
        return;
      }

      const newComment = await commentService.createComment(validatedData.data);
      ApiResponse.success(res, 201, 'Comment created successfully', newComment);
    } catch (error) {
      ApiResponse.error(res, 500, 'Error creating comment', error);
    }
  }

  /**
   * Retrieves comments for a specific worksheet or cell.
   * @param req - The request object
   * @param res - The response object
   */
  public static async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { worksheetId, cellReference } = req.query;

      if (!worksheetId) {
        ApiResponse.error(res, 400, 'Worksheet ID is required');
        return;
      }

      const comments = await commentService.getComments(worksheetId as string, cellReference as string);
      ApiResponse.success(res, 200, 'Comments retrieved successfully', comments);
    } catch (error) {
      ApiResponse.error(res, 500, 'Error retrieving comments', error);
    }
  }

  /**
   * Handles the update of an existing comment.
   * @param req - The request object
   * @param res - The response object
   */
  public static async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const commentData = req.body;
      const validatedData = validateComment(commentData);

      if (!validatedData.isValid) {
        ApiResponse.error(res, 400, 'Invalid comment data', validatedData.errors);
        return;
      }

      const updatedComment = await commentService.updateComment(id, validatedData.data);
      
      if (!updatedComment) {
        ApiResponse.error(res, 404, 'Comment not found');
        return;
      }

      ApiResponse.success(res, 200, 'Comment updated successfully', updatedComment);
    } catch (error) {
      ApiResponse.error(res, 500, 'Error updating comment', error);
    }
  }

  /**
   * Handles the deletion of a comment.
   * @param req - The request object
   * @param res - The response object
   */
  public static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await commentService.deleteComment(id);

      if (!deleted) {
        ApiResponse.error(res, 404, 'Comment not found');
        return;
      }

      ApiResponse.success(res, 200, 'Comment deleted successfully');
    } catch (error) {
      ApiResponse.error(res, 500, 'Error deleting comment', error);
    }
  }
}

// Apply authentication middleware to all routes
export const authenticatedCommentController = {
  createComment: AuthMiddleware.authenticate(CommentController.createComment),
  getComments: AuthMiddleware.authenticate(CommentController.getComments),
  updateComment: AuthMiddleware.authenticate(CommentController.updateComment),
  deleteComment: AuthMiddleware.authenticate(CommentController.deleteComment),
};