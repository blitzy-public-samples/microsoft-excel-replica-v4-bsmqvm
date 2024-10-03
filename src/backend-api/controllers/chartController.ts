import { Request, Response, NextFunction } from 'express';
import { ChartService } from '../services/chartService';
import { Chart } from '../models/chart';
import { ApiResponse } from '../utils/apiResponse';
import { validate } from '../utils/validation';

export class ChartController {
  private chartService: ChartService;

  constructor(chartService: ChartService) {
    this.chartService = chartService;
  }

  /**
   * Creates a new chart based on the provided data in the request body.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  public async createChart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate the incoming request data
      const validatedData = validate(req.body, 'createChart');

      // Call the ChartService to create the chart
      const createdChart = await this.chartService.createChart(validatedData);

      // Send a standardized success response with the created chart
      ApiResponse.success(res, 201, 'Chart created successfully', createdChart);
    } catch (error) {
      // Pass any errors to the global error handling middleware
      next(error);
    }
  }

  /**
   * Retrieves a specific chart by its ID.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  public async getChart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract the chart ID from the request parameters
      const chartId = req.params.id;

      // Call the ChartService to get the chart
      const chart = await this.chartService.getChart(chartId);

      if (chart) {
        // Send a standardized success response with the retrieved chart
        ApiResponse.success(res, 200, 'Chart retrieved successfully', chart);
      } else {
        // Send a not found response if the chart doesn't exist
        ApiResponse.notFound(res, 'Chart not found');
      }
    } catch (error) {
      // Pass any errors to the global error handling middleware
      next(error);
    }
  }

  /**
   * Updates an existing chart with the provided data.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  public async updateChart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract the chart ID from the request parameters
      const chartId = req.params.id;

      // Validate the incoming request data
      const validatedData = validate(req.body, 'updateChart');

      // Call the ChartService to update the chart
      const updatedChart = await this.chartService.updateChart(chartId, validatedData);

      if (updatedChart) {
        // Send a standardized success response with the updated chart
        ApiResponse.success(res, 200, 'Chart updated successfully', updatedChart);
      } else {
        // Send a not found response if the chart doesn't exist
        ApiResponse.notFound(res, 'Chart not found');
      }
    } catch (error) {
      // Pass any errors to the global error handling middleware
      next(error);
    }
  }

  /**
   * Deletes a specific chart by its ID.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  public async deleteChart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract the chart ID from the request parameters
      const chartId = req.params.id;

      // Call the ChartService to delete the chart
      const deleted = await this.chartService.deleteChart(chartId);

      if (deleted) {
        // Send a standardized success response confirming the deletion
        ApiResponse.success(res, 200, 'Chart deleted successfully');
      } else {
        // Send a not found response if the chart doesn't exist
        ApiResponse.notFound(res, 'Chart not found');
      }
    } catch (error) {
      // Pass any errors to the global error handling middleware
      next(error);
    }
  }

  /**
   * Retrieves all charts for a specific workbook or worksheet.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  public async getAllCharts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract the workbook or worksheet ID from the request query parameters
      const { workbookId, worksheetId } = req.query;

      let charts: Chart[];

      if (worksheetId) {
        // Call the ChartService to get charts by worksheet
        charts = await this.chartService.getChartsByWorksheet(worksheetId as string);
      } else if (workbookId) {
        // Call the ChartService to get charts by workbook
        charts = await this.chartService.getChartsByWorkbook(workbookId as string);
      } else {
        throw new Error('Either workbookId or worksheetId must be provided');
      }

      // Send a standardized success response with the array of charts
      ApiResponse.success(res, 200, 'Charts retrieved successfully', charts);
    } catch (error) {
      // Pass any errors to the global error handling middleware
      next(error);
    }
  }
}