import mongoose from 'mongoose';
import { Range } from '../models/range';
import { Cell } from '../models/cell';
import { Worksheet } from '../models/worksheet';
import { ApiResponse } from '../utils/apiResponse';
import { ValidationUtils } from '../utils/validation';

class RangeService {
  /**
   * Creates a new range within a specified worksheet
   * @param worksheetId - The ID of the worksheet
   * @param startCell - The starting cell of the range
   * @param endCell - The ending cell of the range
   * @param name - The name of the range (optional)
   * @returns A promise that resolves to an ApiResponse object
   */
  async createRange(
    worksheetId: string,
    startCell: { row: number; col: number },
    endCell: { row: number; col: number },
    name?: string
  ): Promise<ApiResponse> {
    try {
      // Validate input parameters
      ValidationUtils.validateObjectId(worksheetId);
      ValidationUtils.validateCell(startCell);
      ValidationUtils.validateCell(endCell);
      if (name) ValidationUtils.validateRangeName(name);

      // Check if the worksheet exists
      const worksheet = await Worksheet.findById(worksheetId);
      if (!worksheet) {
        return ApiResponse.notFound('Worksheet not found');
      }

      // Validate that the start and end cells are within the worksheet boundaries
      if (!this.areCellsWithinWorksheet(startCell, endCell, worksheet)) {
        return ApiResponse.badRequest('Range is outside worksheet boundaries');
      }

      // Create a new Range document
      const range = new Range({
        worksheet: worksheetId,
        startCell,
        endCell,
        name,
      });

      // Update the cells within the range to reference the new range
      await this.updateCellsWithRangeReference(worksheetId, startCell, endCell, range._id);

      // Save the range document
      await range.save();

      return ApiResponse.success('Range created successfully', range);
    } catch (error) {
      console.error('Error in createRange:', error);
      return ApiResponse.serverError('An error occurred while creating the range');
    }
  }

  /**
   * Retrieves a range by its ID
   * @param rangeId - The ID of the range to retrieve
   * @returns A promise that resolves to an ApiResponse object
   */
  async getRange(rangeId: string): Promise<ApiResponse> {
    try {
      ValidationUtils.validateObjectId(rangeId);

      const range = await Range.findById(rangeId).populate('worksheet');
      if (!range) {
        return ApiResponse.notFound('Range not found');
      }

      return ApiResponse.success('Range retrieved successfully', range);
    } catch (error) {
      console.error('Error in getRange:', error);
      return ApiResponse.serverError('An error occurred while retrieving the range');
    }
  }

  /**
   * Updates an existing range with new data
   * @param rangeId - The ID of the range to update
   * @param updateData - Partial Range object containing the fields to update
   * @returns A promise that resolves to an ApiResponse object
   */
  async updateRange(rangeId: string, updateData: Partial<Range>): Promise<ApiResponse> {
    try {
      ValidationUtils.validateObjectId(rangeId);
      ValidationUtils.validateUpdateData(updateData);

      const range = await Range.findById(rangeId);
      if (!range) {
        return ApiResponse.notFound('Range not found');
      }

      // Check if the range boundaries have changed
      const boundariesChanged = 
        updateData.startCell !== undefined || 
        updateData.endCell !== undefined;

      // Update the range with the new data
      Object.assign(range, updateData);
      await range.save();

      // If the range boundaries have changed, update affected cells
      if (boundariesChanged) {
        await this.updateAffectedCells(range);
      }

      return ApiResponse.success('Range updated successfully', range);
    } catch (error) {
      console.error('Error in updateRange:', error);
      return ApiResponse.serverError('An error occurred while updating the range');
    }
  }

  /**
   * Deletes a range by its ID
   * @param rangeId - The ID of the range to delete
   * @returns A promise that resolves to an ApiResponse object
   */
  async deleteRange(rangeId: string): Promise<ApiResponse> {
    try {
      ValidationUtils.validateObjectId(rangeId);

      const range = await Range.findById(rangeId);
      if (!range) {
        return ApiResponse.notFound('Range not found');
      }

      // Remove range references from affected cells
      await this.removeCellsRangeReference(range.worksheet, range.startCell, range.endCell, rangeId);

      // Delete the range document
      await Range.findByIdAndDelete(rangeId);

      return ApiResponse.success('Range deleted successfully');
    } catch (error) {
      console.error('Error in deleteRange:', error);
      return ApiResponse.serverError('An error occurred while deleting the range');
    }
  }

  /**
   * Applies a formula to all cells within a range
   * @param rangeId - The ID of the range
   * @param formula - The formula to apply
   * @returns A promise that resolves to an ApiResponse object
   */
  async applyFormulaToRange(rangeId: string, formula: string): Promise<ApiResponse> {
    try {
      ValidationUtils.validateObjectId(rangeId);
      ValidationUtils.validateFormula(formula);

      const range = await Range.findById(rangeId);
      if (!range) {
        return ApiResponse.notFound('Range not found');
      }

      // Update all cells within the range with the new formula
      await this.updateCellsWithFormula(range.worksheet, range.startCell, range.endCell, formula);

      // Trigger recalculation for affected cells (this would be handled by the CalculationEngine)
      // await CalculationEngine.recalculateRange(range);

      return ApiResponse.success('Formula applied to range successfully');
    } catch (error) {
      console.error('Error in applyFormulaToRange:', error);
      return ApiResponse.serverError('An error occurred while applying the formula to the range');
    }
  }

  /**
   * Applies formatting options to all cells within a range
   * @param rangeId - The ID of the range
   * @param formatOptions - The formatting options to apply
   * @returns A promise that resolves to an ApiResponse object
   */
  async formatRange(rangeId: string, formatOptions: object): Promise<ApiResponse> {
    try {
      ValidationUtils.validateObjectId(rangeId);
      ValidationUtils.validateFormatOptions(formatOptions);

      const range = await Range.findById(rangeId);
      if (!range) {
        return ApiResponse.notFound('Range not found');
      }

      // Apply the formatting options to all cells within the range
      await this.updateCellsWithFormatting(range.worksheet, range.startCell, range.endCell, formatOptions);

      return ApiResponse.success('Range formatted successfully');
    } catch (error) {
      console.error('Error in formatRange:', error);
      return ApiResponse.serverError('An error occurred while formatting the range');
    }
  }

  // Helper methods

  private areCellsWithinWorksheet(
    startCell: { row: number; col: number },
    endCell: { row: number; col: number },
    worksheet: any
  ): boolean {
    return (
      startCell.row >= 1 &&
      startCell.col >= 1 &&
      endCell.row <= worksheet.rowCount &&
      endCell.col <= worksheet.columnCount
    );
  }

  private async updateCellsWithRangeReference(
    worksheetId: string,
    startCell: { row: number; col: number },
    endCell: { row: number; col: number },
    rangeId: mongoose.Types.ObjectId
  ): Promise<void> {
    await Cell.updateMany(
      {
        worksheet: worksheetId,
        row: { $gte: startCell.row, $lte: endCell.row },
        col: { $gte: startCell.col, $lte: endCell.col },
      },
      { $addToSet: { ranges: rangeId } }
    );
  }

  private async removeCellsRangeReference(
    worksheetId: string,
    startCell: { row: number; col: number },
    endCell: { row: number; col: number },
    rangeId: string
  ): Promise<void> {
    await Cell.updateMany(
      {
        worksheet: worksheetId,
        row: { $gte: startCell.row, $lte: endCell.row },
        col: { $gte: startCell.col, $lte: endCell.col },
      },
      { $pull: { ranges: rangeId } }
    );
  }

  private async updateAffectedCells(range: any): Promise<void> {
    // Remove range reference from cells that are no longer part of the range
    await this.removeCellsRangeReference(range.worksheet, range.startCell, range.endCell, range._id);

    // Add range reference to cells that are now part of the range
    await this.updateCellsWithRangeReference(range.worksheet, range.startCell, range.endCell, range._id);
  }

  private async updateCellsWithFormula(
    worksheetId: string,
    startCell: { row: number; col: number },
    endCell: { row: number; col: number },
    formula: string
  ): Promise<void> {
    await Cell.updateMany(
      {
        worksheet: worksheetId,
        row: { $gte: startCell.row, $lte: endCell.row },
        col: { $gte: startCell.col, $lte: endCell.col },
      },
      { $set: { formula: formula } }
    );
  }

  private async updateCellsWithFormatting(
    worksheetId: string,
    startCell: { row: number; col: number },
    endCell: { row: number; col: number },
    formatOptions: object
  ): Promise<void> {
    await Cell.updateMany(
      {
        worksheet: worksheetId,
        row: { $gte: startCell.row, $lte: endCell.row },
        col: { $gte: startCell.col, $lte: endCell.col },
      },
      { $set: { format: formatOptions } }
    );
  }
}

export const rangeService = new RangeService();