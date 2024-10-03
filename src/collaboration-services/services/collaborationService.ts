import { Redis } from 'redis';
import { createRedisClient } from '../config/redis';
import { CollaborationSessionModel, CollaborationSessionDocument } from '../models/collaborationSession';
import { PresenceService } from './presenceService';
import { VersionControlService } from './versionControlService';
import { diffPatch } from '../utils/diffPatch';

export class CollaborationService {
  private redisClient: Redis.RedisClient;
  private presenceService: PresenceService;
  private versionControlService: VersionControlService;

  constructor(
    redisClient: Redis.RedisClient,
    presenceService: PresenceService,
    versionControlService: VersionControlService
  ) {
    this.redisClient = redisClient;
    this.presenceService = presenceService;
    this.versionControlService = versionControlService;
  }

  /**
   * Creates a new collaboration session for a workbook.
   * @param workbookId The ID of the workbook.
   * @param userId The ID of the user creating the session.
   * @returns A promise that resolves to the created collaboration session document.
   */
  async createCollaborationSession(workbookId: string, userId: string): Promise<CollaborationSessionDocument> {
    try {
      const session = new CollaborationSessionModel({
        workbookId,
        participants: [userId],
        createdBy: userId,
        lastModified: new Date(),
      });

      const savedSession = await session.save();

      // Initialize the session in Redis for real-time updates
      await this.redisClient.set(`session:${savedSession._id}`, JSON.stringify(savedSession));

      return savedSession;
    } catch (error) {
      console.error('Error creating collaboration session:', error);
      throw new Error('Failed to create collaboration session');
    }
  }

  /**
   * Allows a user to join an existing collaboration session.
   * @param sessionId The ID of the collaboration session.
   * @param userId The ID of the user joining the session.
   */
  async joinCollaborationSession(sessionId: string, userId: string): Promise<void> {
    try {
      const session = await CollaborationSessionModel.findById(sessionId);
      if (!session) {
        throw new Error('Collaboration session not found');
      }

      if (!session.participants.includes(userId)) {
        session.participants.push(userId);
        await session.save();
      }

      // Notify other participants of the new user
      await this.notifyParticipants(sessionId, 'user_joined', { userId });

      // Initialize the user's presence in Redis
      await this.presenceService.setUserPresence(sessionId, userId, 'active');
    } catch (error) {
      console.error('Error joining collaboration session:', error);
      throw new Error('Failed to join collaboration session');
    }
  }

  /**
   * Removes a user from a collaboration session.
   * @param sessionId The ID of the collaboration session.
   * @param userId The ID of the user leaving the session.
   */
  async leaveCollaborationSession(sessionId: string, userId: string): Promise<void> {
    try {
      const session = await CollaborationSessionModel.findById(sessionId);
      if (!session) {
        throw new Error('Collaboration session not found');
      }

      session.participants = session.participants.filter(id => id !== userId);
      await session.save();

      // Notify other participants of the user's departure
      await this.notifyParticipants(sessionId, 'user_left', { userId });

      // Remove the user's presence from Redis
      await this.presenceService.removeUserPresence(sessionId, userId);
    } catch (error) {
      console.error('Error leaving collaboration session:', error);
      throw new Error('Failed to leave collaboration session');
    }
  }

  /**
   * Applies changes made by a user to the shared workbook and broadcasts them to other participants.
   * @param sessionId The ID of the collaboration session.
   * @param userId The ID of the user making the changes.
   * @param changes The changes to be applied.
   */
  async applyChanges(sessionId: string, userId: string, changes: any): Promise<void> {
    try {
      const session = await CollaborationSessionModel.findById(sessionId);
      if (!session) {
        throw new Error('Collaboration session not found');
      }

      // Validate the user's permission to make changes
      if (!session.participants.includes(userId)) {
        throw new Error('User is not a participant in this session');
      }

      // Apply the changes to the workbook using diffPatch utilities
      const updatedWorkbook = diffPatch.apply(session.workbookData, changes);

      // Update the version history using VersionControlService
      await this.versionControlService.createVersion(sessionId, userId, changes);

      // Update the session with the new workbook data
      session.workbookData = updatedWorkbook;
      session.lastModified = new Date();
      await session.save();

      // Broadcast the changes to other participants via Redis
      await this.notifyParticipants(sessionId, 'changes_applied', { userId, changes });
    } catch (error) {
      console.error('Error applying changes:', error);
      throw new Error('Failed to apply changes');
    }
  }

  /**
   * Retrieves the details of a collaboration session.
   * @param sessionId The ID of the collaboration session.
   * @returns A promise that resolves to the collaboration session document or null if not found.
   */
  async getCollaborationSession(sessionId: string): Promise<CollaborationSessionDocument | null> {
    try {
      return await CollaborationSessionModel.findById(sessionId);
    } catch (error) {
      console.error('Error retrieving collaboration session:', error);
      throw new Error('Failed to retrieve collaboration session');
    }
  }

  /**
   * Ends a collaboration session and performs necessary cleanup.
   * @param sessionId The ID of the collaboration session.
   */
  async endCollaborationSession(sessionId: string): Promise<void> {
    try {
      const session = await CollaborationSessionModel.findById(sessionId);
      if (!session) {
        throw new Error('Collaboration session not found');
      }

      // Notify all participants that the session is ending
      await this.notifyParticipants(sessionId, 'session_ended', {});

      // Remove the session data from Redis
      await this.redisClient.del(`session:${sessionId}`);

      // Update the session status in the database
      session.status = 'ended';
      session.endedAt = new Date();
      await session.save();

      // Perform any necessary cleanup operations
      await this.presenceService.removeAllUserPresence(sessionId);
      await this.versionControlService.finalizeVersionHistory(sessionId);
    } catch (error) {
      console.error('Error ending collaboration session:', error);
      throw new Error('Failed to end collaboration session');
    }
  }

  /**
   * Notifies all participants in a session about an event.
   * @param sessionId The ID of the collaboration session.
   * @param event The event type.
   * @param data The event data.
   */
  private async notifyParticipants(sessionId: string, event: string, data: any): Promise<void> {
    const message = JSON.stringify({ event, data });
    await this.redisClient.publish(`session:${sessionId}:events`, message);
  }
}

// Export a factory function to create the CollaborationService
export const createCollaborationService = (): CollaborationService => {
  const redisClient = createRedisClient();
  const presenceService = new PresenceService(redisClient);
  const versionControlService = new VersionControlService();
  return new CollaborationService(redisClient, presenceService, versionControlService);
};