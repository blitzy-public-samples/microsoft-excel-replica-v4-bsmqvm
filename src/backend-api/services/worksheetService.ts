import { Worksheet, IWorksheet } from '../models/worksheet';
import { Workbook } from '../models/workbook';
import { validateWorksheetData } from '../utils/validation';
import { ApiResponse } from '../utils/apiResponse';
import mongoose from 'mongoose';

export interface IWorksheetInput {
  name: string;
  // Add other properties as needed
}

export class WorksheetService {
  /**
   * Creates a new worksheet within the specified workbook
   * @param workbookId The ID of the workbook to create the worksheet in
   * @param worksheetData The data for the new worksheet
   * @returns A Promise resolving to the created worksheet
   */
  async createWorksheet(workbookId: string, worksheetData: IWorksheetInput): Promise<IWorksheet> {
    try {
      // Validate input data
      validateWorksheetData(worksheetData);

      // Find the workbook
      const workbook = await Workbook.findById(workbookId);
      if (!workbook) {
        throw new Error('Workbook not found');
      }

      // Create a new Worksheet document
      const worksheet = new Worksheet({
        ...worksheetData,
        workbook: workbookId
      });

      // Save the worksheet
      await worksheet.save();

      // Add the worksheet to the workbook's worksheets array
      workbook.worksheets.push(worksheet._id);
      await workbook.save();

      return worksheet;
    } catch (error) {
      throw new Error(`Failed to create worksheet: ${error.message}`);
    }
  }

  /**
   * Retrieves a worksheet by its ID
   * @param worksheetId The ID of the worksheet to retrieve
   * @returns A Promise resolving to the retrieved worksheet or null if not found
   */
  async getWorksheet(worksheetId: string): Promise<IWorksheet | null> {
    try {
      return await Worksheet.findById(worksheetId).populate('workbook');
    } catch (error) {
      throw new Error(`Failed to get worksheet: ${error.message}`);
    }
  }

  /**
   * Updates an existing worksheet with the provided data
   * @param worksheetId The ID of the worksheet to update
   * @param updateData The data to update the worksheet with
   * @returns A Promise resolving to the updated worksheet or null if not found
   */
  async updateWorksheet(worksheetId: string, updateData: Partial<IWorksheetInput>): Promise<IWorksheet | null> {
    try {
      // Validate update data
      validateWorksheetData(updateData);

      const updatedWorksheet = await Worksheet.findByIdAndUpdate(
        worksheetId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return updatedWorksheet;
    } catch (error) {
      throw new Error(`Failed to update worksheet: ${error.message}`);
    }
  }

  /**
   * Deletes a worksheet by its ID
   * @param worksheetId The ID of the worksheet to delete
   * @returns A Promise resolving to true if the worksheet was deleted, false otherwise
   */
  async deleteWorksheet(worksheetId: string): Promise<boolean> {
    try {
      const worksheet = await Worksheet.findById(worksheetId);
      if (!worksheet) {
        return false;
      }

      // Remove the worksheet reference from its parent workbook
      await Workbook.findByIdAndUpdate(worksheet.workbook, {
        $pull: { worksheets: worksheetId }
      });

      // Delete the worksheet
      await Worksheet.findByIdAndDelete(worksheetId);

      return true;
    } catch (error) {
      throw new Error(`Failed to delete worksheet: ${error.message}`);
    }
  }

  /**
   * Retrieves all worksheets associated with a specific workbook
   * @param workbookId The ID of the workbook
   * @returns A Promise resolving to an array of worksheets belonging to the workbook
   */
  async getWorksheetsByWorkbook(workbookId: string): Promise<IWorksheet[]> {
    try {
      return await Worksheet.find({ workbook: workbookId });
    } catch (error) {
      throw new Error(`Failed to get worksheets by workbook: ${error.message}`);
    }
  }

  /**
   * Updates a specific cell within a worksheet
   * @param worksheetId The ID of the worksheet
   * @param row The row number of the cell
   * @param col The column number of the cell
   * @param value The new value for the cell
   * @param formula The new formula for the cell (optional)
   * @returns A Promise resolving to the updated worksheet or null if not found
   */
  async updateCell(worksheetId: string, row: number, col: number, value: any, formula?: string): Promise<IWorksheet | null> {
    try {
      const worksheet = await Worksheet.findById(worksheetId);
      if (!worksheet) {
        return null;
      }

      // Update the cell at the specified row and column
      if (!worksheet.cells) {
        worksheet.cells = {};
      }
      if (!worksheet.cells[row]) {
        worksheet.cells[row] = {};
      }
      worksheet.cells[row][col] = { value, formula };

      // Save the updated worksheet
      await worksheet.save();

      return worksheet;
    } catch (error) {
      throw new Error(`Failed to update cell: ${error.message}`);
    }
  }

  /**
   * Adds a new chart to the worksheet
   * @param worksheetId The ID of the worksheet
   * @param chartData The data for the new chart
   * @returns A Promise resolving to the updated worksheet with the new chart or null if not found
   */
  async addChart(worksheetId: string, chartData: any): Promise<IWorksheet | null> {
    try {
      // Validate chart data (implement this validation in the validation utility)
      // validateChartData(chartData);

      const worksheet = await Worksheet.findById(worksheetId);
      if (!worksheet) {
        return null;
      }

      // Create a new chart and add it to the worksheet's charts array
      if (!worksheet.charts) {
        worksheet.charts = [];
      }
      worksheet.charts.push(chartData);

      // Save the updated worksheet
      await worksheet.save();

      return worksheet;
    } catch (error) {
      throw new Error(`Failed to add chart: ${error.message}`);
    }
  }

  /**
   * Removes a chart from the worksheet
   * @param worksheetId The ID of the worksheet
   * @param chartId The ID of the chart to remove
   * @returns A Promise resolving to the updated worksheet with the chart removed or null if not found
   */
  async removeChart(worksheetId: string, chartId: string): Promise<IWorksheet | null> {
    try {
      const worksheet = await Worksheet.findById(worksheetId);
      if (!worksheet) {
        return null;
      }

      // Remove the chart with the given chartId from the worksheet's charts array
      if (worksheet.charts) {
        worksheet.charts = worksheet.charts.filter(chart => chart._id.toString() !== chartId);
      }

      // Save the updated worksheet
      await worksheet.save();

      return worksheet;
    } catch (error) {
      throw new Error(`Failed to remove chart: ${error.message}`);
    }
  }
}

export const worksheetService = new WorksheetService();