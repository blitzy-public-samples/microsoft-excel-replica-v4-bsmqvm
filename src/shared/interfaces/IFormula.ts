import { FormulaType } from '../enums/FormulaTypeEnum';
import { CellReference } from '../types/FormulaTypes';

/**
 * This interface defines the structure and properties of a formula in Microsoft Excel.
 * It represents the core attributes and behaviors of formulas used for calculations
 * and data analysis within cells.
 */
export interface IFormula {
  /** Unique identifier for the formula */
  id: string;

  /** The actual formula expression as a string */
  expression: string;

  /** The type of formula (e.g., simple, array, dynamic array) */
  type: FormulaType;

  /** Array of cell references that this formula depends on */
  dependencies: CellReference[];

  /** The calculated result of the formula */
  result: any;

  /** Indicates whether the formula is valid */
  isValid: boolean;

  /** Error message if the formula is invalid or encounters an error during calculation */
  error: string;

  /** Timestamp of when the formula was last calculated */
  lastCalculated: Date;

  /** Indicates the volatility of the formula (e.g., 'volatile', 'non-volatile') */
  volatility: string;

  /** Array of cell references that precede this formula in the calculation chain */
  precedents: CellReference[];

  /** Array of cell references that depend on this formula */
  dependents: CellReference[];

  /** The range of cells affected by an array formula, if applicable */
  arrayRange: string;

  /** Indicates whether the formula is part of an iterative calculation */
  isIterative: boolean;

  /** The number of iterations performed for iterative calculations */
  iterationCount: number;

  /** Array of function names used in the formula */
  functionNames: string[];
}