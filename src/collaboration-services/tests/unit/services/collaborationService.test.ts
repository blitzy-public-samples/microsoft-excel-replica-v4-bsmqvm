import { CollaborationService } from '../../services/collaborationService';
import { CollaborationSessionModel } from '../../models/collaborationSession';
import { createRedisClient } from '../../config/redis';
import { PresenceService } from '../../services/presenceService';
import { VersionControlService } from '../../services/versionControlService';
import { jest } from '@jest/globals';
import { mockRedis } from 'redis-mock';
import mongoose from 'mongoose';

// Mock dependencies
jest.mock('../../config/redis');
jest.mock('../../services/presenceService');
jest.mock('../../services/versionControlService');
jest.mock('../../models/collaborationSession');
jest.mock('mongoose');

let mockRedisClient: any;
let mockPresenceService: jest.Mocked<PresenceService>;
let mockVersionControlService: jest.Mocked<VersionControlService>;
let collaborationService: CollaborationService;

beforeAll(() => {
  // Set up mock Redis client
  mockRedisClient = mockRedis.createClient();
  (createRedisClient as jest.Mock).mockReturnValue(mockRedisClient);

  // Set up mock PresenceService
  mockPresenceService = {
    addUserPresence: jest.fn(),
    removeUserPresence: jest.fn(),
  } as any;

  // Set up mock VersionControlService
  mockVersionControlService = {
    createVersion: jest.fn(),
  } as any;

  // Mock mongoose models
  (mongoose.model as jest.Mock).mockReturnValue({
    create: jest.fn(),
    findById: jest.fn(),
  });
});

afterAll(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
  collaborationService = new CollaborationService(
    mockPresenceService,
    mockVersionControlService
  );
});

describe('CollaborationService', () => {
  describe('createCollaborationSession', () => {
    it('should create a new collaboration session successfully', async () => {
      const sampleSession = {
        _id: 'session1',
        participants: ['user1'],
        documentId: 'doc1',
      };
      (CollaborationSessionModel.create as jest.Mock).mockResolvedValue(sampleSession);

      const result = await collaborationService.createCollaborationSession('user1', 'doc1');

      expect(result).toEqual(sampleSession);
      expect(CollaborationSessionModel.create).toHaveBeenCalledWith({
        participants: ['user1'],
        documentId: 'doc1',
      });
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `collaboration:session:${sampleSession._id}`,
        JSON.stringify(sampleSession)
      );
    });

    it('should handle errors when creating a session fails', async () => {
      (CollaborationSessionModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(collaborationService.createCollaborationSession('user1', 'doc1')).rejects.toThrow('Failed to create collaboration session');
    });
  });

  describe('joinCollaborationSession', () => {
    it('should allow a user to join an existing collaboration session', async () => {
      const sampleSession = {
        _id: 'session1',
        participants: ['user1'],
        documentId: 'doc1',
        save: jest.fn(),
      };
      (CollaborationSessionModel.findById as jest.Mock).mockResolvedValue(sampleSession);

      await collaborationService.joinCollaborationSession('session1', 'user2');

      expect(sampleSession.participants).toContain('user2');
      expect(sampleSession.save).toHaveBeenCalled();
      expect(mockPresenceService.addUserPresence).toHaveBeenCalledWith('session1', 'user2');
    });

    it('should handle errors when joining a session fails', async () => {
      (CollaborationSessionModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(collaborationService.joinCollaborationSession('session1', 'user2')).rejects.toThrow('Collaboration session not found');
    });
  });

  describe('leaveCollaborationSession', () => {
    it('should remove a user from a collaboration session properly', async () => {
      const sampleSession = {
        _id: 'session1',
        participants: ['user1', 'user2'],
        documentId: 'doc1',
        save: jest.fn(),
      };
      (CollaborationSessionModel.findById as jest.Mock).mockResolvedValue(sampleSession);

      await collaborationService.leaveCollaborationSession('session1', 'user2');

      expect(sampleSession.participants).not.toContain('user2');
      expect(sampleSession.save).toHaveBeenCalled();
      expect(mockPresenceService.removeUserPresence).toHaveBeenCalledWith('session1', 'user2');
    });

    it('should handle errors when leaving a session fails', async () => {
      (CollaborationSessionModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(collaborationService.leaveCollaborationSession('session1', 'user2')).rejects.toThrow('Collaboration session not found');
    });
  });

  describe('applyChanges', () => {
    it('should apply changes to a collaboration session and broadcast to other participants', async () => {
      const sampleSession = {
        _id: 'session1',
        participants: ['user1', 'user2'],
        documentId: 'doc1',
      };
      (CollaborationSessionModel.findById as jest.Mock).mockResolvedValue(sampleSession);
      mockVersionControlService.createVersion.mockResolvedValue({ versionId: 'v1' });

      const changes = { cell: 'A1', value: '100' };
      await collaborationService.applyChanges('session1', 'user1', changes);

      expect(mockVersionControlService.createVersion).toHaveBeenCalledWith('doc1', changes);
      expect(mockRedisClient.publish).toHaveBeenCalledWith(
        `collaboration:session:${sampleSession._id}`,
        JSON.stringify({ type: 'changes', data: changes, userId: 'user1' })
      );
    });

    it('should handle errors when applying changes fails', async () => {
      (CollaborationSessionModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(collaborationService.applyChanges('session1', 'user1', {})).rejects.toThrow('Collaboration session not found');
    });
  });

  describe('getCollaborationSession', () => {
    it('should retrieve a collaboration session by its ID', async () => {
      const sampleSession = {
        _id: 'session1',
        participants: ['user1', 'user2'],
        documentId: 'doc1',
      };
      (CollaborationSessionModel.findById as jest.Mock).mockResolvedValue(sampleSession);

      const result = await collaborationService.getCollaborationSession('session1');

      expect(result).toEqual(sampleSession);
      expect(CollaborationSessionModel.findById).toHaveBeenCalledWith('session1');
    });

    it('should handle errors when retrieving a session fails', async () => {
      (CollaborationSessionModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(collaborationService.getCollaborationSession('session1')).rejects.toThrow('Collaboration session not found');
    });
  });

  describe('endCollaborationSession', () => {
    it('should end a collaboration session and clean up properly', async () => {
      const sampleSession = {
        _id: 'session1',
        participants: ['user1', 'user2'],
        documentId: 'doc1',
        status: 'active',
        save: jest.fn(),
      };
      (CollaborationSessionModel.findById as jest.Mock).mockResolvedValue(sampleSession);

      await collaborationService.endCollaborationSession('session1');

      expect(sampleSession.status).toBe('ended');
      expect(sampleSession.save).toHaveBeenCalled();
      expect(mockRedisClient.del).toHaveBeenCalledWith(`collaboration:session:${sampleSession._id}`);
    });

    it('should handle errors when ending a session fails', async () => {
      (CollaborationSessionModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(collaborationService.endCollaborationSession('session1')).rejects.toThrow('Collaboration session not found');
    });
  });
});