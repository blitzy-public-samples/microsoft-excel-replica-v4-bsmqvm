/**
 * This file defines the interface for a worksheet in Microsoft Excel, representing a single sheet
 * within a workbook that contains cells organized in rows and columns.
 */

// Assuming ICell and IChart interfaces are defined in their respective files
import { ICell } from './ICell';
import { IChart } from './IChart';

/**
 * Interface representing a worksheet in Microsoft Excel.
 */
export interface IWorksheet {
  /** Unique identifier for the worksheet */
  id: string;

  /** Name of the worksheet */
  name: string;

  /** Object containing cells, where the key is the cell reference (e.g., 'A1', 'B2') */
  cells: { [key: string]: ICell };

  /** Number of rows in the worksheet */
  rowCount: number;

  /** Number of columns in the worksheet */
  columnCount: number;

  /** Array of charts embedded in the worksheet */
  charts: IChart[];

  /** Indicates whether the worksheet is hidden */
  hidden: boolean;

  /** Color of the worksheet tab */
  tabColor: string;

  /** Zoom level of the worksheet view (e.g., 100 for 100%) */
  zoom: number;

  /** Number of frozen rows at the top of the worksheet */
  frozenRows: number;

  /** Number of frozen columns at the left of the worksheet */
  frozenColumns: number;

  /** Reference to the active cell (e.g., 'A1') */
  activeCell: string;

  /** Reference to the selected range (e.g., 'A1:B5') */
  selectedRange: string;

  /** Array of conditional formatting rules applied to the worksheet */
  conditionalFormats: object[];

  /** Array of data validation rules applied to the worksheet */
  dataValidations: object[];

  /** Array of filter settings applied to the worksheet */
  filters: object[];
}