import { CollaborationSessionModel } from '../models/collaborationSession';
import { DatabaseConnection } from '../config/database';
import { UserRoleEnum } from '../../shared/enums/UserRoleEnum';
import mongoose from 'mongoose';

/**
 * PermissionService class provides methods for managing permissions and access control
 * in collaborative Excel sessions.
 */
export class PermissionService {
  private db: mongoose.Connection;

  /**
   * Initializes the PermissionService with a database connection.
   * @param dbConnection - The mongoose.Connection instance for database operations.
   */
  constructor(dbConnection: mongoose.Connection) {
    this.db = dbConnection;
  }

  /**
   * Grants a specific permission role to a user for a collaboration session.
   * @param sessionId - The ID of the collaboration session.
   * @param userId - The ID of the user to grant permission to.
   * @param role - The role to be granted to the user.
   * @returns A promise that resolves when the permission is granted.
   */
  async grantPermission(sessionId: string, userId: string, role: UserRoleEnum): Promise<void> {
    try {
      // Validate input parameters
      if (!sessionId || !userId || !role) {
        throw new Error('Invalid input parameters');
      }

      // Check if the session exists
      const session = await CollaborationSessionModel.findById(sessionId);
      if (!session) {
        throw new Error('Collaboration session not found');
      }

      // Check if the user already has a permission for this session
      const existingPermission = session.permissions.find(p => p.userId === userId);

      if (existingPermission) {
        // Update the existing permission
        existingPermission.role = role;
      } else {
        // Create a new permission entry
        session.permissions.push({ userId, role });
      }

      // Save the changes to the database
      await session.save();
    } catch (error) {
      console.error('Error granting permission:', error);
      throw error;
    }
  }

  /**
   * Revokes a user's permission for a collaboration session.
   * @param sessionId - The ID of the collaboration session.
   * @param userId - The ID of the user whose permission is to be revoked.
   * @returns A promise that resolves when the permission is revoked.
   */
  async revokePermission(sessionId: string, userId: string): Promise<void> {
    try {
      // Validate input parameters
      if (!sessionId || !userId) {
        throw new Error('Invalid input parameters');
      }

      // Check if the session exists
      const session = await CollaborationSessionModel.findById(sessionId);
      if (!session) {
        throw new Error('Collaboration session not found');
      }

      // Remove the user's permission entry for this session
      session.permissions = session.permissions.filter(p => p.userId !== userId);

      // Save the changes to the database
      await session.save();
    } catch (error) {
      console.error('Error revoking permission:', error);
      throw error;
    }
  }

  /**
   * Checks if a user has the required permission role for a collaboration session.
   * @param sessionId - The ID of the collaboration session.
   * @param userId - The ID of the user to check permissions for.
   * @param requiredRole - The role required for the operation.
   * @returns A promise that resolves to true if the user has the required permission, false otherwise.
   */
  async checkPermission(sessionId: string, userId: string, requiredRole: UserRoleEnum): Promise<boolean> {
    try {
      // Validate input parameters
      if (!sessionId || !userId || !requiredRole) {
        throw new Error('Invalid input parameters');
      }

      // Retrieve the user's permission for the session
      const session = await CollaborationSessionModel.findById(sessionId);
      if (!session) {
        throw new Error('Collaboration session not found');
      }

      const userPermission = session.permissions.find(p => p.userId === userId);

      // Compare the user's role with the required role
      if (!userPermission) {
        return false;
      }

      // Assuming UserRoleEnum is ordered from least to most privileged
      return UserRoleEnum[userPermission.role] >= UserRoleEnum[requiredRole];
    } catch (error) {
      console.error('Error checking permission:', error);
      throw error;
    }
  }

  /**
   * Retrieves all permissions for a given collaboration session.
   * @param sessionId - The ID of the collaboration session.
   * @returns A promise that resolves to an array of user permissions for the session.
   */
  async getSessionPermissions(sessionId: string): Promise<Array<{ userId: string, role: UserRoleEnum }>> {
    try {
      // Validate input parameters
      if (!sessionId) {
        throw new Error('Invalid input parameters');
      }

      // Retrieve all permission entries for the session
      const session = await CollaborationSessionModel.findById(sessionId);
      if (!session) {
        throw new Error('Collaboration session not found');
      }

      // Format and return the permissions data
      return session.permissions.map(p => ({ userId: p.userId, role: p.role }));
    } catch (error) {
      console.error('Error retrieving session permissions:', error);
      throw error;
    }
  }

  /**
   * Updates a user's permission role for a collaboration session.
   * @param sessionId - The ID of the collaboration session.
   * @param userId - The ID of the user whose permission is to be updated.
   * @param newRole - The new role to be assigned to the user.
   * @returns A promise that resolves when the permission is updated.
   */
  async updatePermission(sessionId: string, userId: string, newRole: UserRoleEnum): Promise<void> {
    try {
      // Validate input parameters
      if (!sessionId || !userId || !newRole) {
        throw new Error('Invalid input parameters');
      }

      // Check if the session exists
      const session = await CollaborationSessionModel.findById(sessionId);
      if (!session) {
        throw new Error('Collaboration session not found');
      }

      // Update the user's permission role for the session
      const userPermission = session.permissions.find(p => p.userId === userId);
      if (!userPermission) {
        throw new Error('User permission not found');
      }

      userPermission.role = newRole;

      // Save the changes to the database
      await session.save();
    } catch (error) {
      console.error('Error updating permission:', error);
      throw error;
    }
  }
}