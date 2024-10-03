import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { WorksheetService } from '../services/worksheetService';
import { Worksheet } from '../models/worksheet';
import { ApiResponse } from '../utils/apiResponse';
import { validate } from '../utils/validation';
import { authMiddleware } from '../middleware/auth';

class WorksheetController {
  private worksheetService: WorksheetService;

  constructor(worksheetService: WorksheetService) {
    this.worksheetService = worksheetService;
  }

  /**
   * Creates a new worksheet in a workbook.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  createWorksheet = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate input data
      const validatedData = validate(req.body, 'createWorksheet');

      // Call WorksheetService to create the worksheet
      const createdWorksheet = await this.worksheetService.createWorksheet(validatedData);

      // Send success response with created worksheet
      ApiResponse.success(res, 201, 'Worksheet created successfully', createdWorksheet);
    } catch (error) {
      // Handle errors and send appropriate response
      ApiResponse.error(res, error);
    }
  });

  /**
   * Retrieves a specific worksheet by its ID.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  getWorksheet = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate worksheet ID from request parameters
      const worksheetId = validate(req.params.id, 'worksheetId');

      // Call WorksheetService to get the worksheet
      const worksheet = await this.worksheetService.getWorksheet(worksheetId);

      if (worksheet) {
        // Send success response with retrieved worksheet
        ApiResponse.success(res, 200, 'Worksheet retrieved successfully', worksheet);
      } else {
        // Send not found response if worksheet doesn't exist
        ApiResponse.notFound(res, 'Worksheet not found');
      }
    } catch (error) {
      // Handle errors and send appropriate response
      ApiResponse.error(res, error);
    }
  });

  /**
   * Updates an existing worksheet.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  updateWorksheet = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate worksheet ID and update data from request
      const worksheetId = validate(req.params.id, 'worksheetId');
      const updateData = validate(req.body, 'updateWorksheet');

      // Call WorksheetService to update the worksheet
      const updatedWorksheet = await this.worksheetService.updateWorksheet(worksheetId, updateData);

      if (updatedWorksheet) {
        // Send success response with updated worksheet
        ApiResponse.success(res, 200, 'Worksheet updated successfully', updatedWorksheet);
      } else {
        // Send not found response if worksheet doesn't exist
        ApiResponse.notFound(res, 'Worksheet not found');
      }
    } catch (error) {
      // Handle errors and send appropriate response
      ApiResponse.error(res, error);
    }
  });

  /**
   * Deletes a specific worksheet by its ID.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  deleteWorksheet = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate worksheet ID from request parameters
      const worksheetId = validate(req.params.id, 'worksheetId');

      // Call WorksheetService to delete the worksheet
      const deleted = await this.worksheetService.deleteWorksheet(worksheetId);

      if (deleted) {
        // Send success response if deletion was successful
        ApiResponse.success(res, 200, 'Worksheet deleted successfully');
      } else {
        // Send not found response if worksheet doesn't exist
        ApiResponse.notFound(res, 'Worksheet not found');
      }
    } catch (error) {
      // Handle errors and send appropriate response
      ApiResponse.error(res, error);
    }
  });

  /**
   * Retrieves all worksheets for a specific workbook.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  getAllWorksheets = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate workbook ID from request parameters
      const workbookId = validate(req.params.workbookId, 'workbookId');

      // Call WorksheetService to get all worksheets for the workbook
      const worksheets = await this.worksheetService.getWorksheetsByWorkbook(workbookId);

      if (worksheets.length > 0) {
        // Send success response with retrieved worksheets
        ApiResponse.success(res, 200, 'Worksheets retrieved successfully', worksheets);
      } else {
        // Send success response with empty array if no worksheets found
        ApiResponse.success(res, 200, 'No worksheets found for the workbook', []);
      }
    } catch (error) {
      // Handle errors and send appropriate response
      ApiResponse.error(res, error);
    }
  });
}

export const worksheetController = new WorksheetController(new WorksheetService());