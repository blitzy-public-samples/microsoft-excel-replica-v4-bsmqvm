import { ICell } from '../interfaces/ICell';
import { CellType, CellFormat } from '../types/CellTypes';
import * as MathUtils from '../utils/MathUtils';
import * as StringUtils from '../utils/StringUtils';
import * as DateUtils from '../utils/DateUtils';

/**
 * CellHelper class contains helper functions for manipulating and working with cell data in Microsoft Excel.
 */
export class CellHelper {
  /**
   * Retrieves the raw value of a cell.
   * @param cell The cell to get the value from
   * @returns The raw value of the cell
   */
  static getCellValue(cell: ICell): any {
    if (!cell) {
      throw new Error('Invalid cell');
    }
    return cell.value;
  }

  /**
   * Sets the value of a cell and updates its type and display value.
   * @param cell The cell to set the value for
   * @param value The value to set
   */
  static setCellValue(cell: ICell, value: any): void {
    if (!cell) {
      throw new Error('Invalid cell');
    }

    cell.value = value;
    cell.type = CellHelper.getCellType(value);
    cell.displayValue = CellHelper.formatCellValue(cell);

    // TODO: Implement logic to trigger necessary recalculations or updates
  }

  /**
   * Formats the cell value based on its type and format settings.
   * @param cell The cell to format
   * @returns The formatted cell value as a string
   */
  static formatCellValue(cell: ICell): string {
    if (!cell) {
      throw new Error('Invalid cell');
    }

    switch (cell.type) {
      case CellType.Number:
        return MathUtils.formatNumber(cell.value, cell.format as CellFormat);
      case CellType.Date:
        return DateUtils.formatDate(cell.value, cell.format as string);
      case CellType.Boolean:
        return cell.value ? 'TRUE' : 'FALSE';
      case CellType.Text:
        return StringUtils.formatText(cell.value, cell.format as CellFormat);
      default:
        return String(cell.value);
    }
  }

  /**
   * Determines the CellType based on the provided value.
   * @param value The value to determine the type for
   * @returns The determined CellType
   */
  static getCellType(value: any): CellType {
    if (typeof value === 'number') {
      return CellType.Number;
    } else if (value instanceof Date) {
      return CellType.Date;
    } else if (typeof value === 'boolean') {
      return CellType.Boolean;
    } else if (typeof value === 'string') {
      return CellType.Text;
    } else {
      return CellType.Unknown;
    }
  }

  /**
   * Checks if a cell is empty (has no value).
   * @param cell The cell to check
   * @returns True if the cell is empty, false otherwise
   */
  static isCellEmpty(cell: ICell): boolean {
    return cell.value === null || cell.value === undefined || cell.value === '';
  }

  /**
   * Returns the cell address in A1 notation (e.g., "A1", "B2").
   * @param cell The cell to get the address for
   * @returns The cell address in A1 notation
   */
  static getCellAddress(cell: ICell): string {
    if (!cell || typeof cell.column !== 'number' || typeof cell.row !== 'number') {
      throw new Error('Invalid cell');
    }

    const columnLetter = StringUtils.columnNumberToLetter(cell.column);
    return `${columnLetter}${cell.row + 1}`;
  }

  /**
   * Parses a cell address in A1 notation and returns the row and column numbers.
   * @param address The cell address in A1 notation
   * @returns An object containing the row and column numbers
   */
  static parseCellAddress(address: string): { row: number; column: number } {
    const match = address.match(/^([A-Z]+)(\d+)$/);
    if (!match) {
      throw new Error('Invalid cell address');
    }

    const column = StringUtils.columnLetterToNumber(match[1]);
    const row = parseInt(match[2], 10) - 1;

    return { row, column };
  }
}