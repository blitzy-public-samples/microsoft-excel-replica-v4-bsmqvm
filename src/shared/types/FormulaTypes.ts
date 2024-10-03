// TODO: Import CellType from '../types/CellTypes' when available
// TODO: Import FormulaTypeEnum from '../enums/FormulaTypeEnum' when available
// TODO: Import IFormula from '../interfaces/IFormula' when available

/**
 * Represents a token in a formula, used for parsing and evaluation.
 */
export type FormulaToken = {
  type: 'OPERAND' | 'OPERATOR' | 'FUNCTION' | 'SEPARATOR';
  value: string;
};

/**
 * Represents the Abstract Syntax Tree of a parsed formula.
 */
export type FormulaAST = {
  type: FormulaTypeEnum; // TODO: Replace with actual enum when available
  children: FormulaAST[];
  value: string | number;
};

/**
 * Represents the result of a formula evaluation, including potential errors.
 */
export type FormulaResult = {
  value: number | string | boolean | Date | null;
  error: string;
};

/**
 * Defines the structure of a function argument in Excel formulas.
 */
export type FunctionArgument = {
  name: string;
  type: CellType | CellType[]; // TODO: Replace with actual CellType when available
  optional: boolean;
};

/**
 * Represents an Excel function with its metadata and implementation.
 */
export type ExcelFunction = {
  name: string;
  category: string;
  description: string;
  args: FunctionArgument[];
  returnType: CellType; // TODO: Replace with actual CellType when available
  implementation: Function;
};

/**
 * Defines the interface for a formula parser in the Excel application.
 */
export interface IFormulaParser {
  parse(formula: string): FormulaAST;
  tokenize(formula: string): FormulaToken[];
}

/**
 * Defines the interface for a formula evaluator in the Excel application.
 */
export interface IFormulaEvaluator {
  evaluate(ast: FormulaAST, context: any): FormulaResult;
}

// Export any additional types or interfaces that might be needed