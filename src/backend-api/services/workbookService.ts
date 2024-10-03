import { Workbook, IWorkbook } from '../models/workbook';
import { Worksheet } from '../models/worksheet';
import { logger } from '../utils/logger';
import { validateWorkbookData } from '../utils/validation';
import mongoose from 'mongoose';

export interface IWorkbookCreate {
  // Define the structure for workbook creation data
  name: string;
  // Add other necessary fields
}

export interface IWorkbookUpdate {
  // Define the structure for workbook update data
  name?: string;
  // Add other necessary fields
}

export interface IWorkbookFilters {
  // Define the structure for workbook filters
  // Add necessary fields for filtering
}

export class WorkbookService {
  /**
   * Creates a new workbook in the database
   * @param workbookData The data for creating a new workbook
   * @param userId The ID of the user creating the workbook
   * @returns The created workbook
   */
  async createWorkbook(workbookData: IWorkbookCreate, userId: string): Promise<IWorkbook> {
    try {
      // Validate input data
      validateWorkbookData(workbookData);

      // Create a new Workbook document
      const workbook = new Workbook({
        ...workbookData,
        owner: userId,
        createdAt: new Date(),
        modifiedAt: new Date()
      });

      // Save the workbook to the database
      await workbook.save();

      logger.info(`Workbook created: ${workbook._id}`);
      return workbook;
    } catch (error) {
      logger.error(`Error creating workbook: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieves a workbook from the database
   * @param workbookId The ID of the workbook to retrieve
   * @param userId The ID of the user requesting the workbook
   * @returns The retrieved workbook
   */
  async getWorkbook(workbookId: string, userId: string): Promise<IWorkbook> {
    try {
      const workbook = await Workbook.findById(workbookId);

      if (!workbook) {
        throw new Error('Workbook not found');
      }

      // Check if the user has permission to access the workbook
      if (workbook.owner.toString() !== userId && !workbook.sharedWith.includes(userId)) {
        throw new Error('User does not have permission to access this workbook');
      }

      return workbook;
    } catch (error) {
      logger.error(`Error retrieving workbook: ${error.message}`);
      throw error;
    }
  }

  /**
   * Updates an existing workbook in the database
   * @param workbookId The ID of the workbook to update
   * @param updateData The data to update in the workbook
   * @param userId The ID of the user updating the workbook
   * @returns The updated workbook
   */
  async updateWorkbook(workbookId: string, updateData: Partial<IWorkbookUpdate>, userId: string): Promise<IWorkbook> {
    try {
      // Validate update data
      validateWorkbookData(updateData);

      const workbook = await Workbook.findById(workbookId);

      if (!workbook) {
        throw new Error('Workbook not found');
      }

      // Check if the user has permission to update the workbook
      if (workbook.owner.toString() !== userId) {
        throw new Error('User does not have permission to update this workbook');
      }

      // Update the workbook
      Object.assign(workbook, updateData);
      workbook.modifiedAt = new Date();

      await workbook.save();

      logger.info(`Workbook updated: ${workbook._id}`);
      return workbook;
    } catch (error) {
      logger.error(`Error updating workbook: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deletes a workbook from the database
   * @param workbookId The ID of the workbook to delete
   * @param userId The ID of the user deleting the workbook
   */
  async deleteWorkbook(workbookId: string, userId: string): Promise<void> {
    try {
      const workbook = await Workbook.findById(workbookId);

      if (!workbook) {
        throw new Error('Workbook not found');
      }

      // Check if the user has permission to delete the workbook
      if (workbook.owner.toString() !== userId) {
        throw new Error('User does not have permission to delete this workbook');
      }

      // Delete the workbook
      await Workbook.findByIdAndDelete(workbookId);

      // Delete associated worksheets and data
      await Worksheet.deleteMany({ workbook: workbookId });

      logger.info(`Workbook deleted: ${workbookId}`);
    } catch (error) {
      logger.error(`Error deleting workbook: ${error.message}`);
      throw error;
    }
  }

  /**
   * Shares a workbook with another user
   * @param workbookId The ID of the workbook to share
   * @param sharedUserId The ID of the user to share the workbook with
   * @param permission The permission level to grant the shared user
   * @param ownerId The ID of the workbook owner
   * @returns The shared workbook
   */
  async shareWorkbook(workbookId: string, sharedUserId: string, permission: string, ownerId: string): Promise<IWorkbook> {
    try {
      const workbook = await Workbook.findById(workbookId);

      if (!workbook) {
        throw new Error('Workbook not found');
      }

      // Check if the owner has permission to share the workbook
      if (workbook.owner.toString() !== ownerId) {
        throw new Error('User does not have permission to share this workbook');
      }

      // Add the shared user to the workbook's access list
      workbook.sharedWith.push({
        user: sharedUserId,
        permission: permission
      });

      await workbook.save();

      logger.info(`Workbook shared: ${workbookId} with user: ${sharedUserId}`);
      return workbook;
    } catch (error) {
      logger.error(`Error sharing workbook: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lists workbooks accessible to a user based on filters
   * @param userId The ID of the user
   * @param filters Filters to apply to the workbook list
   * @returns Array of accessible workbooks
   */
  async listWorkbooks(userId: string, filters: IWorkbookFilters): Promise<IWorkbook[]> {
    try {
      const query = {
        $or: [
          { owner: userId },
          { 'sharedWith.user': userId }
        ]
      };

      // Apply additional filters
      if (filters) {
        // Add filter conditions to the query
        // Example: if (filters.name) query.name = { $regex: filters.name, $options: 'i' };
      }

      const workbooks = await Workbook.find(query).sort({ modifiedAt: -1 });

      return workbooks;
    } catch (error) {
      logger.error(`Error listing workbooks: ${error.message}`);
      throw error;
    }
  }
}

export const workbookService = new WorkbookService();