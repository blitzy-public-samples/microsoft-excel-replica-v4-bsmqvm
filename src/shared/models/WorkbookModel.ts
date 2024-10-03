import { BaseModel } from './BaseModel';
import { WorksheetModel } from './WorksheetModel';
import { IWorkbook } from '../interfaces/IWorkbook';
import { validateWorkbookName } from '../utils/ValidationUtils';
import { Observable } from 'rxjs';

export class WorkbookModel extends BaseModel implements IWorkbook {
  name: string;
  worksheets: WorksheetModel[];
  activeSheet: number;
  author: string;
  createdDate: Date;
  modifiedDate: Date;
  sharedUsers: string[];
  isReadOnly: boolean;
  fileFormat: string;
  calculationMode: 'auto' | 'manual';
  globalNamedRanges: { [key: string]: string };
  customProperties: { [key: string]: any };
  externalDataConnections: any[];
  macros: any[];
  protectionPassword: string;
  version: string;
  compatibilityMode: boolean;

  constructor(id: string, name: string) {
    super(id);
    this.setName(name);
    this.worksheets = [];
    this.activeSheet = 0;
    this.author = '';
    this.createdDate = new Date();
    this.modifiedDate = new Date();
    this.sharedUsers = [];
    this.isReadOnly = false;
    this.fileFormat = 'xlsx';
    this.calculationMode = 'auto';
    this.globalNamedRanges = {};
    this.customProperties = {};
    this.externalDataConnections = [];
    this.macros = [];
    this.protectionPassword = '';
    this.version = '1.0';
    this.compatibilityMode = false;
  }

  setName(name: string): void {
    if (validateWorkbookName(name)) {
      this.name = name;
    } else {
      throw new Error('Invalid workbook name');
    }
  }

  addWorksheet(name: string): WorksheetModel {
    const newWorksheet = new WorksheetModel(this.worksheets.length.toString(), name);
    this.worksheets.push(newWorksheet);
    return newWorksheet;
  }

  removeWorksheet(index: number): void {
    if (index >= 0 && index < this.worksheets.length) {
      this.worksheets.splice(index, 1);
      if (this.activeSheet >= this.worksheets.length) {
        this.activeSheet = this.worksheets.length - 1;
      }
    } else {
      throw new Error('Invalid worksheet index');
    }
  }

  setActiveSheet(index: number): void {
    if (index >= 0 && index < this.worksheets.length) {
      this.activeSheet = index;
    } else {
      throw new Error('Invalid worksheet index');
    }
  }

  addNamedRange(name: string, range: string): void {
    if (this.validateRangeName(name) && this.validateRangeReference(range)) {
      this.globalNamedRanges[name] = range;
    } else {
      throw new Error('Invalid named range');
    }
  }

  removeNamedRange(name: string): void {
    if (this.globalNamedRanges.hasOwnProperty(name)) {
      delete this.globalNamedRanges[name];
    } else {
      throw new Error('Named range not found');
    }
  }

  addExternalDataConnection(connection: any): void {
    // TODO: Implement validation for external data connection
    this.externalDataConnections.push(connection);
  }

  setProtectionPassword(password: string): void {
    // TODO: Implement password strength validation
    this.protectionPassword = password;
  }

  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      worksheets: this.worksheets.map(ws => ws.toJSON()),
      activeSheet: this.activeSheet,
      author: this.author,
      createdDate: this.createdDate.toISOString(),
      modifiedDate: this.modifiedDate.toISOString(),
      sharedUsers: this.sharedUsers,
      isReadOnly: this.isReadOnly,
      fileFormat: this.fileFormat,
      calculationMode: this.calculationMode,
      globalNamedRanges: this.globalNamedRanges,
      customProperties: this.customProperties,
      externalDataConnections: this.externalDataConnections,
      macros: this.macros,
      version: this.version,
      compatibilityMode: this.compatibilityMode
    };
  }

  private validateRangeName(name: string): boolean {
    // TODO: Implement range name validation
    return true;
  }

  private validateRangeReference(range: string): boolean {
    // TODO: Implement range reference validation
    return true;
  }
}