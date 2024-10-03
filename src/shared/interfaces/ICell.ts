/**
 * This file defines the interface for a cell in Microsoft Excel, representing the fundamental unit of data storage and manipulation within a worksheet.
 */

// TODO: Import CellType and CellFormat from '../types/CellTypes' once the file is created

/**
 * This interface defines the structure and properties of a cell in Microsoft Excel.
 */
export interface ICell {
  /** Unique identifier for the cell */
  id: string;

  /** Row number of the cell */
  row: number;

  /** Column number of the cell */
  column: number;

  /** The actual value stored in the cell (can be of any type) */
  value: any;

  /** The formatted value of the cell as displayed to the user */
  displayValue: string;

  /** The formula associated with the cell, if any */
  formula: string;

  /** The type of data stored in the cell */
  type: CellType; // TODO: Define CellType in '../types/CellTypes.ts'

  /** The formatting options applied to the cell */
  format: CellFormat; // TODO: Define CellFormat in '../types/CellTypes.ts'

  /** Indicates whether the cell is locked for editing */
  isLocked: boolean;

  /** Any comment associated with the cell */
  comment: string;

  /** Hyperlink associated with the cell, if any */
  hyperlink: string;

  /** Data validation rules applied to the cell */
  validation: object;

  /** Array of error messages associated with the cell */
  errors: string[];
}