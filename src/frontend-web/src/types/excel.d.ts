import { ChartTypes } from '../types/chart';

// Represents the possible values that can be stored in an Excel cell.
export type ICellValue = number | string | boolean | Date | string;

// Represents a single cell in an Excel worksheet.
export interface ICell {
  row: number;
  column: number;
  value: ICellValue;
  formula: string;
  format: ICellFormat;
}

// Represents the formatting options for a cell.
export interface ICellFormat {
  numberFormat: string;
  font: IFont;
  fill: IFill;
  border: IBorder;
  alignment: IAlignment;
}

// Represents the font properties for cell formatting.
export interface IFont {
  name: string;
  size: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
}

// Represents the fill (background) properties for cell formatting.
export interface IFill {
  type: 'solid' | 'pattern';
  color: string;
  pattern?: string;
}

// Represents the border properties for cell formatting.
export interface IBorder {
  top: IBorderStyle;
  right: IBorderStyle;
  bottom: IBorderStyle;
  left: IBorderStyle;
}

// Represents the style of a cell border.
export interface IBorderStyle {
  style: string;
  color: string;
}

// Represents the alignment properties for cell formatting.
export interface IAlignment {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'middle' | 'bottom';
  wrapText: boolean;
}

// Represents a range of cells in an Excel worksheet.
export interface IRange {
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
}

// Represents a worksheet in an Excel workbook.
export interface IWorksheet {
  id: string;
  name: string;
  cells: ICell[][];
  charts: ChartTypes[];
}

// Represents an Excel workbook.
export interface IWorkbook {
  id: string;
  name: string;
  sheets: IWorksheet[];
  activeSheet: number;
}

// Represents a cell reference in A1 notation.
export type CellReference = string;

// Represents a range reference in A1 notation.
export type RangeReference = string;

// Represents the different types of formulas supported in Excel.
export type FormulaType =
  | 'SUM'
  | 'AVERAGE'
  | 'COUNT'
  | 'MIN'
  | 'MAX'
  | 'IF'
  | 'VLOOKUP'
  | 'INDEX'
  | 'MATCH'
  | 'CONCATENATE'
  | 'DATE'
  | 'NOW'
  | 'PMT'
  | 'FV'
  | 'NPV'
  | 'RAND'
  | string;