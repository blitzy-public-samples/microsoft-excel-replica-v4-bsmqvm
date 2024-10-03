import { CellType } from '../types/excel';
import { getCellValue } from './cellUtils';
import { round } from '../../shared/utils/MathUtils';
import { validateFormula } from '../../shared/utils/ValidationUtils';

/**
 * Parses a formula string and returns a function that can evaluate the formula given a set of cells.
 * @param formula The formula string to parse
 * @returns A function that takes cells as input and returns a number or string
 */
export function parseFormula(formula: string): (cells: Record<string, CellType>) => number | string {
  // Validate the formula
  if (!validateFormula(formula)) {
    throw new Error('Invalid formula');
  }

  // Parse the formula string into tokens
  const tokens = tokenizeFormula(formula);

  // Create a function that evaluates the parsed formula
  return (cells: Record<string, CellType>) => {
    // Implement the formula evaluation logic here
    // This is a simplified example and should be expanded for full formula support
    return evaluateTokens(tokens, cells);
  };
}

/**
 * Evaluates a formula string using the provided cell values.
 * @param formula The formula string to evaluate
 * @param cells An object containing cell values
 * @returns The result of the formula evaluation
 */
export function evaluateFormula(formula: string, cells: Record<string, CellType>): number | string {
  const evaluationFunction = parseFormula(formula);
  const result = evaluationFunction(cells);

  // Round the result if it's a number
  if (typeof result === 'number') {
    return round(result, 10); // Round to 10 decimal places
  }

  return result;
}

/**
 * Checks if a given string is a valid Excel formula.
 * @param value The string to check
 * @returns True if the string is a valid formula, false otherwise
 */
export function isFormula(value: string): boolean {
  return value.startsWith('=') && validateFormula(value.slice(1));
}

/**
 * Extracts all cell references from a formula string.
 * @param formula The formula string to extract cell references from
 * @returns An array of cell references found in the formula
 */
export function extractCellReferences(formula: string): string[] {
  const cellReferenceRegex = /[A-Z]+[0-9]+/g;
  return formula.match(cellReferenceRegex) || [];
}

/**
 * Formats the result of a formula evaluation for display.
 * @param result The result of the formula evaluation
 * @returns The formatted result string
 */
export function formatFormulaResult(result: number | string): string {
  if (typeof result === 'number') {
    // Round the number to a reasonable number of decimal places
    return round(result, 2).toString();
  }
  return result.toString();
}

// Helper functions

function tokenizeFormula(formula: string): string[] {
  // Implement formula tokenization logic
  // This is a simplified example and should be expanded for full formula support
  return formula.split(/([+\-*/()])/g).filter(token => token.trim() !== '');
}

function evaluateTokens(tokens: string[], cells: Record<string, CellType>): number | string {
  // Implement token evaluation logic
  // This is a simplified example and should be expanded for full formula support
  let result = 0;
  let currentOperator = '+';

  for (const token of tokens) {
    if (token === '+' || token === '-' || token === '*' || token === '/') {
      currentOperator = token;
    } else {
      const value = evaluateToken(token, cells);
      switch (currentOperator) {
        case '+':
          result += value;
          break;
        case '-':
          result -= value;
          break;
        case '*':
          result *= value;
          break;
        case '/':
          if (value === 0) throw new Error('Division by zero');
          result /= value;
          break;
      }
    }
  }

  return result;
}

function evaluateToken(token: string, cells: Record<string, CellType>): number {
  if (token.match(/^[A-Z]+[0-9]+$/)) {
    // Cell reference
    return Number(getCellValue(cells[token]));
  } else {
    // Numeric value
    return Number(token);
  }
}