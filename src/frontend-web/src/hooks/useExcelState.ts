import { useState, useCallback, useContext } from 'react';
import { ExcelState, ExcelStateActions } from '../types/excel';
import { updateCell } from '../utils/cellUtils';
import { evaluateFormula } from '../utils/formulaUtils';
import { api } from '../services/api';

// Assuming these types are defined in the excel.ts file
interface Cell {
  value: string | number;
  formula?: string;
}

interface Worksheet {
  id: string;
  name: string;
  cells: { [key: string]: Cell };
}

interface ExcelState {
  workbookId: string;
  activeWorksheetId: string;
  worksheets: Worksheet[];
}

const useExcelState = (): [ExcelState, ExcelStateActions] => {
  const [excelState, setExcelState] = useState<ExcelState>({
    workbookId: '',
    activeWorksheetId: '',
    worksheets: [],
  });

  const updateCellValue = useCallback(
    (worksheetId: string, cellId: string, value: string | number, formula?: string) => {
      setExcelState((prevState) => {
        const updatedWorksheets = prevState.worksheets.map((worksheet) => {
          if (worksheet.id === worksheetId) {
            const updatedCells = {
              ...worksheet.cells,
              [cellId]: { value, formula },
            };
            return { ...worksheet, cells: updatedCells };
          }
          return worksheet;
        });

        return { ...prevState, worksheets: updatedWorksheets };
      });

      // Debounced API call to sync state
      debouncedApiSync(worksheetId, cellId, value, formula);
    },
    []
  );

  const evaluateCellFormula = useCallback(
    (worksheetId: string, cellId: string, formula: string) => {
      const worksheet = excelState.worksheets.find((ws) => ws.id === worksheetId);
      if (!worksheet) return;

      const result = evaluateFormula(formula, worksheet.cells);
      updateCellValue(worksheetId, cellId, result, formula);
    },
    [excelState.worksheets, updateCellValue]
  );

  const addWorksheet = useCallback((name: string) => {
    const newWorksheet: Worksheet = {
      id: `ws_${Date.now()}`,
      name,
      cells: {},
    };

    setExcelState((prevState) => ({
      ...prevState,
      worksheets: [...prevState.worksheets, newWorksheet],
      activeWorksheetId: newWorksheet.id,
    }));

    // API call to create a new worksheet
    api.createWorksheet(excelState.workbookId, newWorksheet);
  }, [excelState.workbookId]);

  const setActiveWorksheet = useCallback((worksheetId: string) => {
    setExcelState((prevState) => ({
      ...prevState,
      activeWorksheetId: worksheetId,
    }));
  }, []);

  const debouncedApiSync = useCallback(
    debounce((worksheetId: string, cellId: string, value: string | number, formula?: string) => {
      api.updateCell(excelState.workbookId, worksheetId, cellId, value, formula);
    }, 1000),
    [excelState.workbookId]
  );

  const actions: ExcelStateActions = {
    updateCellValue,
    evaluateCellFormula,
    addWorksheet,
    setActiveWorksheet,
  };

  return [excelState, actions];
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default useExcelState;