import { BaseModel } from './BaseModel';
import { CellModel } from './CellModel';
import { IWorksheet } from '../interfaces/IWorksheet';
import { CellType } from '../types/CellTypes';
import { validateWorksheetName } from '../utils/ValidationUtils';
import { Observable } from 'rxjs';

export class WorksheetModel extends BaseModel implements IWorksheet {
  private _name: string;
  private _cells: { [key: string]: CellModel };
  private _rowCount: number;
  private _columnCount: number;
  private _charts: any[]; // TODO: Replace 'any' with proper Chart type when implemented
  private _hidden: boolean;
  private _tabColor: string;
  private _zoom: number;
  private _frozenRows: number;
  private _frozenColumns: number;
  private _activeCell: string;
  private _selectedRange: string;
  private _conditionalFormats: any[]; // TODO: Replace 'any' with proper ConditionalFormat type when implemented
  private _dataValidations: any[]; // TODO: Replace 'any' with proper DataValidation type when implemented
  private _filters: any[]; // TODO: Replace 'any' with proper Filter type when implemented

  constructor(id: string, name: string) {
    super(id);
    this.setName(name);
    this._cells = {};
    this._rowCount = 1000; // Default row count
    this._columnCount = 26; // Default column count (A to Z)
    this._charts = [];
    this._hidden = false;
    this._tabColor = '';
    this._zoom = 100;
    this._frozenRows = 0;
    this._frozenColumns = 0;
    this._activeCell = 'A1';
    this._selectedRange = 'A1';
    this._conditionalFormats = [];
    this._dataValidations = [];
    this._filters = [];
  }

  get name(): string {
    return this._name;
  }

  setName(name: string): void {
    if (validateWorksheetName(name)) {
      this._name = name;
    } else {
      throw new Error('Invalid worksheet name');
    }
  }

  getCell(address: string): CellModel {
    if (!this._cells[address]) {
      const [column, row] = this.parseAddress(address);
      this._cells[address] = new CellModel(address, row, column);
    }
    return this._cells[address];
  }

  setCellValue(address: string, value: CellType): void {
    const cell = this.getCell(address);
    cell.setValue(value);
  }

  addChart(chart: any): void { // TODO: Replace 'any' with proper Chart type when implemented
    this._charts.push(chart);
  }

  removeChart(chartId: string): void {
    const index = this._charts.findIndex(chart => chart.id === chartId);
    if (index !== -1) {
      this._charts.splice(index, 1);
    }
  }

  applyConditionalFormat(format: any): void { // TODO: Replace 'any' with proper ConditionalFormat type when implemented
    this._conditionalFormats.push(format);
  }

  applyDataValidation(validation: any): void { // TODO: Replace 'any' with proper DataValidation type when implemented
    this._dataValidations.push(validation);
  }

  applyFilter(filter: any): void { // TODO: Replace 'any' with proper Filter type when implemented
    this._filters.push(filter);
  }

  toJSON(): object {
    return {
      id: this.id,
      name: this._name,
      cells: Object.values(this._cells).map(cell => cell.toJSON()),
      rowCount: this._rowCount,
      columnCount: this._columnCount,
      charts: this._charts,
      hidden: this._hidden,
      tabColor: this._tabColor,
      zoom: this._zoom,
      frozenRows: this._frozenRows,
      frozenColumns: this._frozenColumns,
      activeCell: this._activeCell,
      selectedRange: this._selectedRange,
      conditionalFormats: this._conditionalFormats,
      dataValidations: this._dataValidations,
      filters: this._filters
    };
  }

  private parseAddress(address: string): [string, number] {
    const match = address.match(/^([A-Z]+)(\d+)$/);
    if (!match) {
      throw new Error('Invalid cell address');
    }
    return [match[1], parseInt(match[2], 10)];
  }

  // Implement other IWorksheet methods and properties here

  // Observable for changes in the worksheet
  public changes: Observable<WorksheetModel> = new Observable((observer) => {
    // Implement change detection and notification logic here
    // This is a placeholder and should be properly implemented
    observer.next(this);
  });
}