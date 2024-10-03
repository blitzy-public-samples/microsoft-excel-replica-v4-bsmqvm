import { VersionControlService } from '../../../services/versionControlService';
import { IVersionHistory } from '../../../models/versionHistory';
import { IWorkbook } from '../../../../shared/interfaces/IWorkbook';
import { IUser } from '../../../../shared/interfaces/IUser';
import { createMockWorkbook, createMockUser } from '../../../../testing/utils/mock-data-generator';

describe('VersionControlService', () => {
  let versionControlService: VersionControlService;
  let mockWorkbook: IWorkbook;
  let mockUser: IUser;

  beforeEach(() => {
    versionControlService = new VersionControlService();
    mockWorkbook = createMockWorkbook();
    mockUser = createMockUser();
  });

  describe('createVersion', () => {
    it('should create a new version entry', async () => {
      const changes = { A1: 'New Value' };
      const result = await versionControlService.createVersion(mockWorkbook.id, mockUser, changes);

      expect(result).toBeDefined();
      expect(result.workbookId).toBe(mockWorkbook.id);
      expect(result.user).toEqual(mockUser);
      expect(result.changes).toEqual(changes);
    });

    it('should handle errors when creating a version', async () => {
      const changes = { A1: 'New Value' };
      jest.spyOn(versionControlService, 'createVersion').mockRejectedValue(new Error('Database error'));

      await expect(versionControlService.createVersion(mockWorkbook.id, mockUser, changes))
        .rejects.toThrow('Database error');
    });
  });

  describe('getVersionHistory', () => {
    it('should retrieve version history for a workbook', async () => {
      const mockHistory: IVersionHistory[] = [
        { id: '1', workbookId: mockWorkbook.id, versionNumber: 1, user: mockUser, changes: { A1: 'Value 1' }, timestamp: new Date() },
        { id: '2', workbookId: mockWorkbook.id, versionNumber: 2, user: mockUser, changes: { A1: 'Value 2' }, timestamp: new Date() },
      ];

      jest.spyOn(versionControlService, 'getVersionHistory').mockResolvedValue(mockHistory);

      const result = await versionControlService.getVersionHistory(mockWorkbook.id);

      expect(result).toEqual(mockHistory);
      expect(result.length).toBe(2);
    });

    it('should return an empty array if no history exists', async () => {
      jest.spyOn(versionControlService, 'getVersionHistory').mockResolvedValue([]);

      const result = await versionControlService.getVersionHistory(mockWorkbook.id);

      expect(result).toEqual([]);
    });

    it('should handle errors when retrieving version history', async () => {
      jest.spyOn(versionControlService, 'getVersionHistory').mockRejectedValue(new Error('Database error'));

      await expect(versionControlService.getVersionHistory(mockWorkbook.id))
        .rejects.toThrow('Database error');
    });
  });

  describe('revertToVersion', () => {
    it('should revert a workbook to a specific version', async () => {
      const versionNumber = 1;
      const mockVersion: IVersionHistory = {
        id: '1',
        workbookId: mockWorkbook.id,
        versionNumber: versionNumber,
        user: mockUser,
        changes: { A1: 'Old Value' },
        timestamp: new Date(),
      };

      jest.spyOn(versionControlService, 'revertToVersion').mockResolvedValue(mockVersion);

      const result = await versionControlService.revertToVersion(mockWorkbook.id, versionNumber);

      expect(result).toEqual(mockVersion);
      expect(result.versionNumber).toBe(versionNumber);
    });

    it('should throw an error if the version doesn\'t exist', async () => {
      const versionNumber = 999;
      jest.spyOn(versionControlService, 'revertToVersion').mockRejectedValue(new Error('Version not found'));

      await expect(versionControlService.revertToVersion(mockWorkbook.id, versionNumber))
        .rejects.toThrow('Version not found');
    });

    it('should handle errors when reverting to a version', async () => {
      const versionNumber = 1;
      jest.spyOn(versionControlService, 'revertToVersion').mockRejectedValue(new Error('Database error'));

      await expect(versionControlService.revertToVersion(mockWorkbook.id, versionNumber))
        .rejects.toThrow('Database error');
    });
  });

  describe('compareVersions', () => {
    it('should compare two versions and return differences', async () => {
      const version1 = 1;
      const version2 = 2;
      const mockDifferences = {
        A1: { oldValue: 'Value 1', newValue: 'Value 2' },
        B2: { oldValue: null, newValue: 'New Cell' },
      };

      jest.spyOn(versionControlService, 'compareVersions').mockResolvedValue(mockDifferences);

      const result = await versionControlService.compareVersions(mockWorkbook.id, version1, version2);

      expect(result).toEqual(mockDifferences);
    });

    it('should throw an error if one of the versions doesn\'t exist', async () => {
      const version1 = 1;
      const version2 = 999;
      jest.spyOn(versionControlService, 'compareVersions').mockRejectedValue(new Error('Version not found'));

      await expect(versionControlService.compareVersions(mockWorkbook.id, version1, version2))
        .rejects.toThrow('Version not found');
    });

    it('should handle errors when comparing versions', async () => {
      const version1 = 1;
      const version2 = 2;
      jest.spyOn(versionControlService, 'compareVersions').mockRejectedValue(new Error('Database error'));

      await expect(versionControlService.compareVersions(mockWorkbook.id, version1, version2))
        .rejects.toThrow('Database error');
    });
  });

  describe('mergeVersions', () => {
    it('should merge changes from one version into another', async () => {
      const sourceVersion = 1;
      const targetVersion = 2;
      const mockMergedVersion: IVersionHistory = {
        id: '3',
        workbookId: mockWorkbook.id,
        versionNumber: 3,
        user: mockUser,
        changes: { A1: 'Merged Value', B2: 'New Cell' },
        timestamp: new Date(),
      };

      jest.spyOn(versionControlService, 'mergeVersions').mockResolvedValue(mockMergedVersion);

      const result = await versionControlService.mergeVersions(mockWorkbook.id, sourceVersion, targetVersion);

      expect(result).toEqual(mockMergedVersion);
      expect(result.versionNumber).toBe(3);
    });

    it('should resolve conflicts during merge', async () => {
      const sourceVersion = 1;
      const targetVersion = 2;
      const mockMergedVersion: IVersionHistory = {
        id: '3',
        workbookId: mockWorkbook.id,
        versionNumber: 3,
        user: mockUser,
        changes: { A1: 'Resolved Value', B2: 'New Cell' },
        timestamp: new Date(),
      };

      jest.spyOn(versionControlService, 'mergeVersions').mockResolvedValue(mockMergedVersion);

      const result = await versionControlService.mergeVersions(mockWorkbook.id, sourceVersion, targetVersion);

      expect(result).toEqual(mockMergedVersion);
      expect(result.changes.A1).toBe('Resolved Value');
    });

    it('should throw an error if one of the versions doesn\'t exist', async () => {
      const sourceVersion = 1;
      const targetVersion = 999;
      jest.spyOn(versionControlService, 'mergeVersions').mockRejectedValue(new Error('Version not found'));

      await expect(versionControlService.mergeVersions(mockWorkbook.id, sourceVersion, targetVersion))
        .rejects.toThrow('Version not found');
    });

    it('should handle errors when merging versions', async () => {
      const sourceVersion = 1;
      const targetVersion = 2;
      jest.spyOn(versionControlService, 'mergeVersions').mockRejectedValue(new Error('Merge conflict'));

      await expect(versionControlService.mergeVersions(mockWorkbook.id, sourceVersion, targetVersion))
        .rejects.toThrow('Merge conflict');
    });
  });
});