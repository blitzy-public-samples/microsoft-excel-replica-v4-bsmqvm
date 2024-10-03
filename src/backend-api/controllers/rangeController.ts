import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { RangeService } from '../services/rangeService';
import { Range } from '../models/range';
import { apiResponse } from '../utils/apiResponse';
import { validate } from '../utils/validation';
import { authMiddleware } from '../middleware/auth';
import { ChartService } from '../services/chartService';

class RangeController {
  private rangeService: RangeService;
  private chartService: ChartService;

  constructor(rangeService: RangeService, chartService: ChartService) {
    this.rangeService = rangeService;
    this.chartService = chartService;
  }

  public getRangeValues = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rangeId = validate(req.params.rangeId, 'string', 'Range identifier is required');
    const rangeValues = await this.rangeService.getRangeValues(rangeId);
    apiResponse(res, 200, 'Range values retrieved successfully', rangeValues);
  });

  public updateRangeValues = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rangeId = validate(req.params.rangeId, 'string', 'Range identifier is required');
    const newValues = validate(req.body.values, 'array', 'New values are required');
    await this.rangeService.updateRangeValues(rangeId, newValues);
    apiResponse(res, 200, 'Range values updated successfully');
  });

  public getRangeFormulas = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rangeId = validate(req.params.rangeId, 'string', 'Range identifier is required');
    const rangeFormulas = await this.rangeService.getRangeFormulas(rangeId);
    apiResponse(res, 200, 'Range formulas retrieved successfully', rangeFormulas);
  });

  public updateRangeFormulas = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rangeId = validate(req.params.rangeId, 'string', 'Range identifier is required');
    const newFormulas = validate(req.body.formulas, 'array', 'New formulas are required');
    await this.rangeService.updateRangeFormulas(rangeId, newFormulas);
    apiResponse(res, 200, 'Range formulas updated successfully');
  });

  public getRangeFormatting = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rangeId = validate(req.params.rangeId, 'string', 'Range identifier is required');
    const rangeFormatting = await this.rangeService.getRangeFormatting(rangeId);
    apiResponse(res, 200, 'Range formatting retrieved successfully', rangeFormatting);
  });

  public updateRangeFormatting = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rangeId = validate(req.params.rangeId, 'string', 'Range identifier is required');
    const newFormatting = validate(req.body.formatting, 'object', 'New formatting is required');
    await this.rangeService.updateRangeFormatting(rangeId, newFormatting);
    apiResponse(res, 200, 'Range formatting updated successfully');
  });

  public calculateRangeStatistics = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rangeId = validate(req.params.rangeId, 'string', 'Range identifier is required');
    const statistics = await this.rangeService.calculateRangeStatistics(rangeId);
    apiResponse(res, 200, 'Range statistics calculated successfully', statistics);
  });

  public createChartFromRange = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rangeId = validate(req.params.rangeId, 'string', 'Range identifier is required');
    const chartType = validate(req.body.chartType, 'string', 'Chart type is required');
    const rangeData = await this.rangeService.getRangeValues(rangeId);
    const chartData = await this.chartService.createChart(rangeData, chartType);
    apiResponse(res, 201, 'Chart created successfully', chartData);
  });
}

export default RangeController;