import mongoose from 'mongoose';
import { Cell } from '../models/cell';
import * as ValidationUtils from '../utils/validation';
import { ApiResponse } from '../utils/apiResponse';

class CellService {
  /**
   * Retrieves the value of a specific cell in a worksheet
   * @param worksheetId - The ID of the worksheet
   * @param row - The row number of the cell
   * @param column - The column number of the cell
   * @returns A promise that resolves to an ApiResponse containing the cell value
   */
  async getCellValue(worksheetId: string, row: number, column: number): Promise<ApiResponse> {
    try {
      // Validate input parameters
      if (!ValidationUtils.isValidObjectId(worksheetId)) {
        return ApiResponse.error('Invalid worksheet ID');
      }
      if (!ValidationUtils.isPositiveInteger(row) || !ValidationUtils.isPositiveInteger(column)) {
        return ApiResponse.error('Invalid row or column number');
      }

      // Query the database for the cell
      const cell = await Cell.findOne({ worksheetId, row, column }).exec();

      if (cell) {
        return ApiResponse.success('Cell value retrieved successfully', { value: cell.value });
      } else {
        return ApiResponse.error('Cell not found');
      }
    } catch (error) {
      console.error('Error in getCellValue:', error);
      return ApiResponse.error('An error occurred while retrieving the cell value');
    }
  }

  /**
   * Updates the value and optionally the formula of a specific cell in a worksheet
   * @param worksheetId - The ID of the worksheet
   * @param row - The row number of the cell
   * @param column - The column number of the cell
   * @param value - The new value for the cell
   * @param formula - The new formula for the cell (optional)
   * @returns A promise that resolves to an ApiResponse indicating the success or failure of the update
   */
  async updateCellValue(worksheetId: string, row: number, column: number, value: any, formula?: string): Promise<ApiResponse> {
    try {
      // Validate input parameters
      if (!ValidationUtils.isValidObjectId(worksheetId)) {
        return ApiResponse.error('Invalid worksheet ID');
      }
      if (!ValidationUtils.isPositiveInteger(row) || !ValidationUtils.isPositiveInteger(column)) {
        return ApiResponse.error('Invalid row or column number');
      }

      // Check if the cell is locked
      const existingCell = await Cell.findOne({ worksheetId, row, column }).exec();
      if (existingCell && existingCell.isLocked) {
        return ApiResponse.error('Cannot update a locked cell');
      }

      // Update the cell value and formula in the database
      const updatedCell = await Cell.findOneAndUpdate(
        { worksheetId, row, column },
        { value, formula },
        { new: true, upsert: true }
      ).exec();

      if (updatedCell) {
        return ApiResponse.success('Cell updated successfully', { cell: updatedCell });
      } else {
        return ApiResponse.error('Failed to update cell');
      }
    } catch (error) {
      console.error('Error in updateCellValue:', error);
      return ApiResponse.error('An error occurred while updating the cell value');
    }
  }

  /**
   * Retrieves the formatting information for a specific cell in a worksheet
   * @param worksheetId - The ID of the worksheet
   * @param row - The row number of the cell
   * @param column - The column number of the cell
   * @returns A promise that resolves to an ApiResponse containing the cell formatting information
   */
  async getCellFormat(worksheetId: string, row: number, column: number): Promise<ApiResponse> {
    try {
      // Validate input parameters
      if (!ValidationUtils.isValidObjectId(worksheetId)) {
        return ApiResponse.error('Invalid worksheet ID');
      }
      if (!ValidationUtils.isPositiveInteger(row) || !ValidationUtils.isPositiveInteger(column)) {
        return ApiResponse.error('Invalid row or column number');
      }

      // Query the database for the cell
      const cell = await Cell.findOne({ worksheetId, row, column }).exec();

      if (cell) {
        return ApiResponse.success('Cell formatting retrieved successfully', { format: cell.format });
      } else {
        return ApiResponse.error('Cell not found');
      }
    } catch (error) {
      console.error('Error in getCellFormat:', error);
      return ApiResponse.error('An error occurred while retrieving the cell formatting');
    }
  }

  /**
   * Updates the formatting of a specific cell in a worksheet
   * @param worksheetId - The ID of the worksheet
   * @param row - The row number of the cell
   * @param column - The column number of the cell
   * @param format - The new formatting object for the cell
   * @returns A promise that resolves to an ApiResponse indicating the success or failure of the format update
   */
  async updateCellFormat(worksheetId: string, row: number, column: number, format: object): Promise<ApiResponse> {
    try {
      // Validate input parameters
      if (!ValidationUtils.isValidObjectId(worksheetId)) {
        return ApiResponse.error('Invalid worksheet ID');
      }
      if (!ValidationUtils.isPositiveInteger(row) || !ValidationUtils.isPositiveInteger(column)) {
        return ApiResponse.error('Invalid row or column number');
      }
      if (!ValidationUtils.isValidFormat(format)) {
        return ApiResponse.error('Invalid format object');
      }

      // Check if the cell is locked
      const existingCell = await Cell.findOne({ worksheetId, row, column }).exec();
      if (existingCell && existingCell.isLocked) {
        return ApiResponse.error('Cannot update format of a locked cell');
      }

      // Update the cell formatting in the database
      const updatedCell = await Cell.findOneAndUpdate(
        { worksheetId, row, column },
        { format },
        { new: true, upsert: true }
      ).exec();

      if (updatedCell) {
        return ApiResponse.success('Cell format updated successfully', { cell: updatedCell });
      } else {
        return ApiResponse.error('Failed to update cell format');
      }
    } catch (error) {
      console.error('Error in updateCellFormat:', error);
      return ApiResponse.error('An error occurred while updating the cell format');
    }
  }

  /**
   * Locks a specific cell in a worksheet to prevent editing
   * @param worksheetId - The ID of the worksheet
   * @param row - The row number of the cell
   * @param column - The column number of the cell
   * @returns A promise that resolves to an ApiResponse indicating the success or failure of the cell locking
   */
  async lockCell(worksheetId: string, row: number, column: number): Promise<ApiResponse> {
    try {
      // Validate input parameters
      if (!ValidationUtils.isValidObjectId(worksheetId)) {
        return ApiResponse.error('Invalid worksheet ID');
      }
      if (!ValidationUtils.isPositiveInteger(row) || !ValidationUtils.isPositiveInteger(column)) {
        return ApiResponse.error('Invalid row or column number');
      }

      // Update the isLocked property of the cell to true
      const updatedCell = await Cell.findOneAndUpdate(
        { worksheetId, row, column },
        { isLocked: true },
        { new: true, upsert: true }
      ).exec();

      if (updatedCell) {
        return ApiResponse.success('Cell locked successfully', { cell: updatedCell });
      } else {
        return ApiResponse.error('Failed to lock cell');
      }
    } catch (error) {
      console.error('Error in lockCell:', error);
      return ApiResponse.error('An error occurred while locking the cell');
    }
  }

  /**
   * Unlocks a specific cell in a worksheet to allow editing
   * @param worksheetId - The ID of the worksheet
   * @param row - The row number of the cell
   * @param column - The column number of the cell
   * @returns A promise that resolves to an ApiResponse indicating the success or failure of the cell unlocking
   */
  async unlockCell(worksheetId: string, row: number, column: number): Promise<ApiResponse> {
    try {
      // Validate input parameters
      if (!ValidationUtils.isValidObjectId(worksheetId)) {
        return ApiResponse.error('Invalid worksheet ID');
      }
      if (!ValidationUtils.isPositiveInteger(row) || !ValidationUtils.isPositiveInteger(column)) {
        return ApiResponse.error('Invalid row or column number');
      }

      // Update the isLocked property of the cell to false
      const updatedCell = await Cell.findOneAndUpdate(
        { worksheetId, row, column },
        { isLocked: false },
        { new: true, upsert: true }
      ).exec();

      if (updatedCell) {
        return ApiResponse.success('Cell unlocked successfully', { cell: updatedCell });
      } else {
        return ApiResponse.error('Failed to unlock cell');
      }
    } catch (error) {
      console.error('Error in unlockCell:', error);
      return ApiResponse.error('An error occurred while unlocking the cell');
    }
  }
}

export const cellService = new CellService();