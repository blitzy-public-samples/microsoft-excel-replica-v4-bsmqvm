import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { CellService } from '../services/cellService';
import { Cell } from '../models/cell';
import { apiResponse } from '../utils/apiResponse';
import { validate } from '../utils/validation';
import { authMiddleware } from '../middleware/auth';

class CellController {
  private cellService: CellService;

  constructor() {
    this.cellService = new CellService();
  }

  @asyncHandler
  public getCellValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { worksheetId, row, column } = req.params;

    validate.cellParams(worksheetId, row, column);

    const cellValue = await this.cellService.getCellValue(worksheetId, parseInt(row), column);
    apiResponse.success(res, 'Cell value retrieved successfully', { value: cellValue });
  }

  @asyncHandler
  public updateCellValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { worksheetId, row, column } = req.params;
    const { value } = req.body;

    validate.cellParams(worksheetId, row, column);
    validate.cellValue(value);

    await this.cellService.updateCellValue(worksheetId, parseInt(row), column, value);
    apiResponse.success(res, 'Cell value updated successfully');
  }

  @asyncHandler
  public getCellFormula = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { worksheetId, row, column } = req.params;

    validate.cellParams(worksheetId, row, column);

    const formula = await this.cellService.getCellFormula(worksheetId, parseInt(row), column);
    apiResponse.success(res, 'Cell formula retrieved successfully', { formula });
  }

  @asyncHandler
  public updateCellFormula = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { worksheetId, row, column } = req.params;
    const { formula } = req.body;

    validate.cellParams(worksheetId, row, column);
    validate.cellFormula(formula);

    await this.cellService.updateCellFormula(worksheetId, parseInt(row), column, formula);
    apiResponse.success(res, 'Cell formula updated successfully');
  }

  @asyncHandler
  public getCellFormatting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { worksheetId, row, column } = req.params;

    validate.cellParams(worksheetId, row, column);

    const formatting = await this.cellService.getCellFormat(worksheetId, parseInt(row), column);
    apiResponse.success(res, 'Cell formatting retrieved successfully', { formatting });
  }

  @asyncHandler
  public updateCellFormatting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { worksheetId, row, column } = req.params;
    const { formatting } = req.body;

    validate.cellParams(worksheetId, row, column);
    validate.cellFormatting(formatting);

    await this.cellService.updateCellFormat(worksheetId, parseInt(row), column, formatting);
    apiResponse.success(res, 'Cell formatting updated successfully');
  }
}

export const cellController = new CellController();

// Apply authentication middleware to all routes
export const protectedCellController = {
  getCellValue: [authMiddleware, cellController.getCellValue],
  updateCellValue: [authMiddleware, cellController.updateCellValue],
  getCellFormula: [authMiddleware, cellController.getCellFormula],
  updateCellFormula: [authMiddleware, cellController.updateCellFormula],
  getCellFormatting: [authMiddleware, cellController.getCellFormatting],
  updateCellFormatting: [authMiddleware, cellController.updateCellFormatting],
};