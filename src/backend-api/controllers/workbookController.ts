import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WorkbookService } from '../services/workbookService';
import { Workbook } from '../models/workbook';
import { ApiResponse } from '../utils/apiResponse';
import { AuthMiddleware } from '../middleware/auth';
import { ValidatorMiddleware } from '../middleware/validator';

export class WorkbookController {
  private workbookService: WorkbookService;

  constructor(workbookService: WorkbookService) {
    this.workbookService = workbookService;
  }

  @AuthMiddleware.authenticate
  @ValidatorMiddleware.validateWorkbookCreation
  public async createWorkbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workbookData: Partial<Workbook> = req.body;
      const createdWorkbook = await this.workbookService.createWorkbook(workbookData);
      ApiResponse.success(res, StatusCodes.CREATED, 'Workbook created successfully', createdWorkbook);
    } catch (error) {
      next(error);
    }
  }

  @AuthMiddleware.authenticate
  public async getWorkbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workbookId = req.params.id;
      const workbook = await this.workbookService.getWorkbook(workbookId);
      if (workbook) {
        ApiResponse.success(res, StatusCodes.OK, 'Workbook retrieved successfully', workbook);
      } else {
        ApiResponse.notFound(res, 'Workbook not found');
      }
    } catch (error) {
      next(error);
    }
  }

  @AuthMiddleware.authenticate
  @ValidatorMiddleware.validateWorkbookUpdate
  public async updateWorkbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workbookId = req.params.id;
      const updateData: Partial<Workbook> = req.body;
      const updatedWorkbook = await this.workbookService.updateWorkbook(workbookId, updateData);
      if (updatedWorkbook) {
        ApiResponse.success(res, StatusCodes.OK, 'Workbook updated successfully', updatedWorkbook);
      } else {
        ApiResponse.notFound(res, 'Workbook not found');
      }
    } catch (error) {
      next(error);
    }
  }

  @AuthMiddleware.authenticate
  public async deleteWorkbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workbookId = req.params.id;
      const deleted = await this.workbookService.deleteWorkbook(workbookId);
      if (deleted) {
        ApiResponse.success(res, StatusCodes.OK, 'Workbook deleted successfully');
      } else {
        ApiResponse.notFound(res, 'Workbook not found');
      }
    } catch (error) {
      next(error);
    }
  }

  @AuthMiddleware.authenticate
  public async listWorkbooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
      const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { [sort as string]: order === 'desc' ? -1 : 1 }
      };
      const workbooks = await this.workbookService.listWorkbooks(options);
      ApiResponse.success(res, StatusCodes.OK, 'Workbooks retrieved successfully', workbooks);
    } catch (error) {
      next(error);
    }
  }

  @AuthMiddleware.authenticate
  @ValidatorMiddleware.validateWorkbookSharing
  public async shareWorkbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workbookId = req.params.id;
      const { userId, permission } = req.body;
      const sharedWorkbook = await this.workbookService.shareWorkbook(workbookId, userId, permission);
      if (sharedWorkbook) {
        ApiResponse.success(res, StatusCodes.OK, 'Workbook shared successfully', sharedWorkbook);
      } else {
        ApiResponse.notFound(res, 'Workbook not found');
      }
    } catch (error) {
      next(error);
    }
  }
}

export const workbookController = new WorkbookController(new WorkbookService());