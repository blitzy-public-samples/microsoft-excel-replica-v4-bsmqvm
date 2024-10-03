import { useState, useCallback, useEffect } from 'react';
import { useExcelContext } from '../context/ExcelContext';

// Assuming these types are defined in the excel.d.ts file
type CellType = {
  value: string | number;
  formula?: string;
};

type ExcelState = {
  cells: { [key: string]: CellType };
};

// Assuming these functions are defined in the formulaUtils.ts file
const parseFormula = (formula: string): string => {
  // Placeholder implementation
  return formula;
};

const evaluateFormula = (formula: string, state: ExcelState): string | number => {
  // Placeholder implementation
  return formula;
};

export const useFormulaParser = () => {
  const { state, updateCell } = useExcelContext();
  const [parseError, setParseError] = useState<string | null>(null);

  const parseCellFormula = useCallback((cellId: string, formula: string) => {
    try {
      const parsedFormula = parseFormula(formula);
      return parsedFormula;
    } catch (error) {
      setParseError(`Error parsing formula: ${error.message}`);
      return formula;
    }
  }, []);

  const evaluateCellFormula = useCallback((cellId: string, formula: string) => {
    try {
      const result = evaluateFormula(formula, state);
      updateCell(cellId, { value: result, formula });
      setParseError(null);
    } catch (error) {
      setParseError(`Error evaluating formula: ${error.message}`);
      updateCell(cellId, { value: '#ERROR!', formula });
    }
  }, [state, updateCell]);

  useEffect(() => {
    // Clear parse error when component unmounts
    return () => setParseError(null);
  }, []);

  return {
    parseFormula: parseCellFormula,
    evaluateFormula: evaluateCellFormula,
    parseError,
  };
};

export default useFormulaParser;