import { ICell } from '../interfaces/ICell';
import { CellType, CellFormat } from '../types/CellTypes';
import { validateCellValue } from '../utils/ValidationUtils';
import { formatCellValue } from '../utils/FormatUtils';

export class CellModel implements ICell {
  id: string;
  row: number;
  column: number;
  value: any;
  displayValue: string;
  formula: string;
  type: CellType;
  format: CellFormat;
  isLocked: boolean;
  comment: string;
  hyperlink: string;
  validation: object;
  errors: string[];

  constructor(props: Partial<ICell>) {
    this.id = props.id || '';
    this.row = props.row || 0;
    this.column = props.column || 0;
    this.value = props.value;
    this.displayValue = props.displayValue || '';
    this.formula = props.formula || '';
    this.type = props.type || 'string';
    this.format = props.format || {};
    this.isLocked = props.isLocked || false;
    this.comment = props.comment || '';
    this.hyperlink = props.hyperlink || '';
    this.validation = props.validation || {};
    this.errors = props.errors || [];

    this.calculateDisplayValue();
  }

  setValue(value: any): void {
    this.value = value;
    this.type = this.determineType(value);
    this.formula = '';
    this.validate();
    this.calculateDisplayValue();
    if (this.errors.length === 0) {
      this.errors = [];
    }
  }

  setFormula(formula: string): void {
    this.formula = formula;
    this.type = 'formula';
    this.validate();
    // TODO: Implement formula calculation
    // this.value = calculateFormulaResult(formula);
    this.calculateDisplayValue();
  }

  setFormat(format: CellFormat): void {
    this.format = { ...this.format, ...format };
    this.calculateDisplayValue();
  }

  validate(): boolean {
    this.errors = [];
    if (this.validation && Object.keys(this.validation).length > 0) {
      const validationResult = validateCellValue(this.value, this.validation);
      if (!validationResult.isValid) {
        this.errors = validationResult.errors;
      }
    }
    return this.errors.length === 0;
  }

  calculateDisplayValue(): void {
    this.displayValue = formatCellValue(this.value, this.type, this.format);
  }

  toJSON(): object {
    return {
      id: this.id,
      row: this.row,
      column: this.column,
      value: this.value,
      displayValue: this.displayValue,
      formula: this.formula,
      type: this.type,
      format: this.format,
      isLocked: this.isLocked,
      comment: this.comment,
      hyperlink: this.hyperlink,
      validation: this.validation,
      errors: this.errors,
    };
  }

  private determineType(value: any): CellType {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (value instanceof Date) return 'date';
    if (typeof value === 'object' && value !== null) return 'object';
    return 'string';
  }
}