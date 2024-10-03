import mongoose from 'mongoose';
import { IVersionHistory, VersionHistoryDocument, createVersionHistoryModel } from '../models/versionHistory';
import { diffPatch } from '../utils/diffPatch';
import { resolveConflicts } from '../utils/conflictResolution';
import { IWorkbook } from '../../shared/interfaces/IWorkbook';
import { IUser } from '../../shared/interfaces/IUser';
import { ErrorHandlingUtils } from '../../shared/utils/ErrorHandlingUtils';

export class VersionControlService {
  private versionHistoryModel: mongoose.Model<VersionHistoryDocument>;

  constructor() {
    this.versionHistoryModel = createVersionHistoryModel();
  }

  /**
   * Creates a new version entry for a workbook.
   * @param workbookId - The ID of the workbook.
   * @param user - The user creating the version.
   * @param changes - The changes made in this version.
   * @param comment - A comment describing the changes.
   * @returns A Promise resolving to the created version history entry.
   */
  async createVersion(workbookId: string, user: IUser, changes: object, comment: string): Promise<IVersionHistory> {
    try {
      // Validate input parameters
      if (!workbookId || !user || !changes) {
        throw new Error('Invalid input parameters');
      }

      // Get the latest version number for the workbook
      const latestVersion = await this.versionHistoryModel
        .findOne({ workbookId })
        .sort({ versionNumber: -1 })
        .select('versionNumber');

      const newVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

      // Create a new version history entry
      const newVersion: IVersionHistory = {
        workbookId,
        versionNumber: newVersionNumber,
        userId: user.id,
        timestamp: new Date(),
        changes,
        comment
      };

      // Save the new version history entry to the database
      const createdVersion = await this.versionHistoryModel.create(newVersion);

      return createdVersion.toObject();
    } catch (error) {
      ErrorHandlingUtils.handleError('Error creating version', error);
      throw error;
    }
  }

  /**
   * Retrieves the version history for a workbook.
   * @param workbookId - The ID of the workbook.
   * @returns A Promise resolving to an array of version history entries.
   */
  async getVersionHistory(workbookId: string): Promise<IVersionHistory[]> {
    try {
      // Validate the workbookId
      if (!workbookId) {
        throw new Error('Invalid workbookId');
      }

      // Query the database for version history entries for the given workbookId
      const versionHistory = await this.versionHistoryModel
        .find({ workbookId })
        .sort({ versionNumber: 1 })
        .lean();

      return versionHistory;
    } catch (error) {
      ErrorHandlingUtils.handleError('Error retrieving version history', error);
      throw error;
    }
  }

  /**
   * Reverts a workbook to a specific version.
   * @param workbookId - The ID of the workbook.
   * @param versionNumber - The version number to revert to.
   * @returns A Promise resolving to the reverted workbook.
   */
  async revertToVersion(workbookId: string, versionNumber: number): Promise<IWorkbook> {
    try {
      // Validate input parameters
      if (!workbookId || !versionNumber) {
        throw new Error('Invalid input parameters');
      }

      // Retrieve the specified version from the database
      const targetVersion = await this.versionHistoryModel.findOne({ workbookId, versionNumber });

      if (!targetVersion) {
        throw new Error('Target version not found');
      }

      // TODO: Implement the logic to apply the changes from the specified version to the current workbook
      // This would involve fetching the current workbook state and applying the changes

      // Create a new version entry for the revert action
      const user: IUser = { id: 'system', name: 'System' }; // Assuming a system user for revert actions
      await this.createVersion(workbookId, user, targetVersion.changes, `Reverted to version ${versionNumber}`);

      // TODO: Update the workbook in the database with the reverted state

      // Return the updated workbook
      // For now, we'll return a placeholder object
      return { id: workbookId } as IWorkbook;
    } catch (error) {
      ErrorHandlingUtils.handleError('Error reverting to version', error);
      throw error;
    }
  }

  /**
   * Compares two versions of a workbook and returns the differences.
   * @param workbookId - The ID of the workbook.
   * @param versionA - The first version number to compare.
   * @param versionB - The second version number to compare.
   * @returns A Promise resolving to an object representing the differences between the two versions.
   */
  async compareVersions(workbookId: string, versionA: number, versionB: number): Promise<object> {
    try {
      // Validate input parameters
      if (!workbookId || !versionA || !versionB) {
        throw new Error('Invalid input parameters');
      }

      // Retrieve both versions from the database
      const [versionADoc, versionBDoc] = await Promise.all([
        this.versionHistoryModel.findOne({ workbookId, versionNumber: versionA }),
        this.versionHistoryModel.findOne({ workbookId, versionNumber: versionB })
      ]);

      if (!versionADoc || !versionBDoc) {
        throw new Error('One or both versions not found');
      }

      // Use the diffPatch utility to calculate the differences
      const differences = diffPatch(versionADoc.changes, versionBDoc.changes);

      return differences;
    } catch (error) {
      ErrorHandlingUtils.handleError('Error comparing versions', error);
      throw error;
    }
  }

  /**
   * Merges changes from one version into another.
   * @param workbookId - The ID of the workbook.
   * @param sourceVersion - The source version number.
   * @param targetVersion - The target version number.
   * @returns A Promise resolving to the merged workbook.
   */
  async mergeVersions(workbookId: string, sourceVersion: number, targetVersion: number): Promise<IWorkbook> {
    try {
      // Validate input parameters
      if (!workbookId || !sourceVersion || !targetVersion) {
        throw new Error('Invalid input parameters');
      }

      // Retrieve both versions from the database
      const [sourceVersionDoc, targetVersionDoc] = await Promise.all([
        this.versionHistoryModel.findOne({ workbookId, versionNumber: sourceVersion }),
        this.versionHistoryModel.findOne({ workbookId, versionNumber: targetVersion })
      ]);

      if (!sourceVersionDoc || !targetVersionDoc) {
        throw new Error('One or both versions not found');
      }

      // Use the diffPatch utility to calculate the differences
      const differences = diffPatch(targetVersionDoc.changes, sourceVersionDoc.changes);

      // Use the conflictResolution utility to resolve any conflicts
      const mergedChanges = resolveConflicts(targetVersionDoc.changes, differences);

      // Create a new version entry for the merge action
      const user: IUser = { id: 'system', name: 'System' }; // Assuming a system user for merge actions
      const mergeComment = `Merged changes from version ${sourceVersion} into version ${targetVersion}`;
      await this.createVersion(workbookId, user, mergedChanges, mergeComment);

      // TODO: Update the workbook in the database with the merged changes

      // Return the updated workbook
      // For now, we'll return a placeholder object
      return { id: workbookId } as IWorkbook;
    } catch (error) {
      ErrorHandlingUtils.handleError('Error merging versions', error);
      throw error;
    }
  }
}

export default VersionControlService;