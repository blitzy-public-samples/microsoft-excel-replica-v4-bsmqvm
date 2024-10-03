import { Request, Response } from 'express';
import { VersionControlService } from '../services/versionControlService';
import { IWorkbook } from '../../shared/interfaces/IWorkbook';
import { IUser } from '../../shared/interfaces/IUser';
import { apiResponse } from '../../shared/utils/apiResponse';
import { ErrorHandlingUtils } from '../../shared/utils/ErrorHandlingUtils';

export class VersionControlController {
  private versionControlService: VersionControlService;

  constructor(versionControlService: VersionControlService) {
    this.versionControlService = versionControlService;
  }

  public async createVersion(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, user, changes, comment } = req.body;
      const createdVersion = await this.versionControlService.createVersion(workbookId, user, changes, comment);
      apiResponse(res, 201, 'Version created successfully', createdVersion);
    } catch (error) {
      ErrorHandlingUtils.handleError(res, error);
    }
  }

  public async getVersionHistory(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId } = req.params;
      const versionHistory = await this.versionControlService.getVersionHistory(workbookId);
      apiResponse(res, 200, 'Version history retrieved successfully', versionHistory);
    } catch (error) {
      ErrorHandlingUtils.handleError(res, error);
    }
  }

  public async revertToVersion(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, versionNumber } = req.body;
      const revertedWorkbook = await this.versionControlService.revertToVersion(workbookId, versionNumber);
      apiResponse(res, 200, 'Workbook reverted to specified version successfully', revertedWorkbook);
    } catch (error) {
      ErrorHandlingUtils.handleError(res, error);
    }
  }

  public async compareVersions(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, versionA, versionB } = req.query;
      const comparison = await this.versionControlService.compareVersions(workbookId, Number(versionA), Number(versionB));
      apiResponse(res, 200, 'Version comparison completed successfully', comparison);
    } catch (error) {
      ErrorHandlingUtils.handleError(res, error);
    }
  }

  public async mergeVersions(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, sourceVersion, targetVersion } = req.body;
      const mergedWorkbook = await this.versionControlService.mergeVersions(workbookId, sourceVersion, targetVersion);
      apiResponse(res, 200, 'Versions merged successfully', mergedWorkbook);
    } catch (error) {
      ErrorHandlingUtils.handleError(res, error);
    }
  }
}