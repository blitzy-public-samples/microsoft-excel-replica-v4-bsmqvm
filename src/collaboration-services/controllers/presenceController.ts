import { Request, Response } from 'express';
import { PresenceService } from '../services/presenceService';
import { IUserPresence } from '../models/userPresence';
import { ApiResponse } from '../utils/apiResponse';
import { ErrorHandlingUtils } from '../../shared/utils/ErrorHandlingUtils';

export class PresenceController {
  private presenceService: PresenceService;

  constructor(presenceService: PresenceService) {
    this.presenceService = presenceService;
  }

  public async updateUserPresence(req: Request, res: Response): Promise<void> {
    try {
      const presenceData: IUserPresence = req.body;
      await this.presenceService.updateUserPresence(presenceData);
      ApiResponse.success(res, 'User presence updated successfully');
    } catch (error) {
      ErrorHandlingUtils.handleError(error, res, 'Error updating user presence');
    }
  }

  public async getUserPresence(req: Request, res: Response): Promise<void> {
    try {
      const { userId, workbookId } = req.params;
      const presence = await this.presenceService.getUserPresence(userId, workbookId);
      ApiResponse.success(res, 'User presence retrieved successfully', presence);
    } catch (error) {
      ErrorHandlingUtils.handleError(error, res, 'Error retrieving user presence');
    }
  }

  public async getWorkbookPresence(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId } = req.params;
      const presenceData = await this.presenceService.getWorkbookPresence(workbookId);
      ApiResponse.success(res, 'Workbook presence retrieved successfully', presenceData);
    } catch (error) {
      ErrorHandlingUtils.handleError(error, res, 'Error retrieving workbook presence');
    }
  }

  public async removeUserPresence(req: Request, res: Response): Promise<void> {
    try {
      const { userId, workbookId } = req.params;
      await this.presenceService.removeUserPresence(userId, workbookId);
      ApiResponse.success(res, 'User presence removed successfully');
    } catch (error) {
      ErrorHandlingUtils.handleError(error, res, 'Error removing user presence');
    }
  }
}