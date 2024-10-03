import { Comment, IComment } from '../models/comment';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { DatabaseConfig } from '../config/database';
import mongoose from 'mongoose';

class CommentService {
  /**
   * Creates a new comment for a specific cell in a worksheet.
   * @param workbookId - The ID of the workbook
   * @param worksheetId - The ID of the worksheet
   * @param cellReference - The cell reference (e.g., 'A1')
   * @param userId - The ID of the user creating the comment
   * @param content - The content of the comment
   * @returns Promise<IComment> - The created comment object
   */
  async createComment(
    workbookId: string,
    worksheetId: string,
    cellReference: string,
    userId: string,
    content: string
  ): Promise<IComment> {
    try {
      // Validate input parameters
      if (!workbookId || !worksheetId || !cellReference || !userId || !content) {
        throw new Error('Missing required parameters');
      }

      // TODO: Implement user permission check
      // await this.checkUserPermissions(userId, workbookId, 'comment');

      // Sanitize comment content
      const sanitizedContent = this.sanitizeContent(content);

      // Create new Comment document
      const newComment = new Comment({
        workbookId,
        worksheetId,
        cellReference,
        userId,
        content: sanitizedContent,
      });

      // Save comment to database
      const savedComment = await newComment.save();

      // Log comment creation
      logger.info(`Comment created: ${savedComment._id}`);

      return savedComment;
    } catch (error) {
      logger.error(`Error creating comment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieves comments for a specific worksheet or cell.
   * @param workbookId - The ID of the workbook
   * @param worksheetId - The ID of the worksheet
   * @param cellReference - Optional cell reference to filter comments
   * @returns Promise<IComment[]> - Array of comment objects
   */
  async getComments(
    workbookId: string,
    worksheetId: string,
    cellReference?: string
  ): Promise<IComment[]> {
    try {
      // Validate input parameters
      if (!workbookId || !worksheetId) {
        throw new Error('Missing required parameters');
      }

      // TODO: Implement user permission check
      // await this.checkUserPermissions(userId, workbookId, 'read');

      // Build database query
      const query: any = { workbookId, worksheetId };
      if (cellReference) {
        query.cellReference = cellReference;
      }

      // Execute query to retrieve comments
      const comments = await Comment.find(query).sort({ createdAt: -1 });

      // Log comment retrieval
      logger.info(`Retrieved ${comments.length} comments for worksheet ${worksheetId}`);

      return comments;
    } catch (error) {
      logger.error(`Error retrieving comments: ${error.message}`);
      throw error;
    }
  }

  /**
   * Updates an existing comment.
   * @param commentId - The ID of the comment to update
   * @param content - The updated content of the comment
   * @param userId - The ID of the user updating the comment
   * @returns Promise<IComment> - The updated comment object
   */
  async updateComment(commentId: string, content: string, userId: string): Promise<IComment> {
    try {
      // Validate input parameters
      if (!commentId || !content || !userId) {
        throw new Error('Missing required parameters');
      }

      // Find the comment
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }

      // TODO: Implement user permission check
      // await this.checkUserPermissions(userId, comment.workbookId, 'edit');

      // Check if the user is the owner of the comment
      if (comment.userId !== userId) {
        throw new Error('User is not authorized to update this comment');
      }

      // Sanitize updated content
      const sanitizedContent = this.sanitizeContent(content);

      // Update the comment
      comment.content = sanitizedContent;
      const updatedComment = await comment.save();

      // Log comment update
      logger.info(`Comment updated: ${updatedComment._id}`);

      return updatedComment;
    } catch (error) {
      logger.error(`Error updating comment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deletes a comment.
   * @param commentId - The ID of the comment to delete
   * @param userId - The ID of the user deleting the comment
   * @returns Promise<boolean> - True if comment was successfully deleted
   */
  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    try {
      // Validate input parameters
      if (!commentId || !userId) {
        throw new Error('Missing required parameters');
      }

      // Find the comment
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }

      // TODO: Implement user permission check
      // await this.checkUserPermissions(userId, comment.workbookId, 'delete');

      // Check if the user is the owner of the comment or has admin privileges
      if (comment.userId !== userId) {
        // TODO: Check if user has admin privileges
        throw new Error('User is not authorized to delete this comment');
      }

      // Delete the comment
      await Comment.findByIdAndDelete(commentId);

      // Log comment deletion
      logger.info(`Comment deleted: ${commentId}`);

      return true;
    } catch (error) {
      logger.error(`Error deleting comment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sanitizes the comment content to prevent XSS attacks.
   * @param content - The raw content to sanitize
   * @returns string - The sanitized content
   */
  private sanitizeContent(content: string): string {
    // TODO: Implement proper content sanitization
    return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // TODO: Implement user permission check method
  // private async checkUserPermissions(userId: string, workbookId: string, action: string): Promise<void> {
  //   // Implement permission check logic
  // }
}

export const commentService = new CommentService();