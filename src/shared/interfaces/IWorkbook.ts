/**
 * This file defines the interface for a workbook in Microsoft Excel, representing the top-level container for worksheets and global workbook properties.
 */

import { IWorksheet } from './IWorksheet';
import { IChart } from './IChart';

/**
 * Interface representing a workbook in Microsoft Excel.
 */
export interface IWorkbook {
  /** Unique identifier for the workbook */
  id: string;

  /** Name of the workbook */
  name: string;

  /** Array of worksheets contained in the workbook */
  worksheets: IWorksheet[];

  /** Index of the currently active worksheet */
  activeSheet: number;

  /** Author of the workbook */
  author: string;

  /** Date when the workbook was created */
  createdDate: Date;

  /** Date when the workbook was last modified */
  modifiedDate: Date;

  /** Array of user IDs who have shared access to the workbook */
  sharedUsers: string[];

  /** Flag indicating if the workbook is in read-only mode */
  isReadOnly: boolean;

  /** File format of the workbook (e.g., 'xlsx', 'xls', 'csv') */
  fileFormat: string;

  /** Calculation mode for the workbook ('auto' or 'manual') */
  calculationMode: 'auto' | 'manual';

  /** Object containing global named ranges in the workbook */
  globalNamedRanges: { [key: string]: string };

  /** Object containing custom properties for the workbook */
  customProperties: { [key: string]: any };

  /** Array of external data connections used in the workbook */
  externalDataConnections: object[];

  /** Array of macros associated with the workbook */
  macros: object[];

  /** Password for workbook protection */
  protectionPassword: string;

  /** Version of the workbook */
  version: string;

  /** Flag indicating if the workbook is in compatibility mode */
  compatibilityMode: boolean;

  /** Array of charts shared across worksheets */
  sharedCharts?: IChart[];
}