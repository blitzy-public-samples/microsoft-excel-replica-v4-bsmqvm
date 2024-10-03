import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { api } from '../services/api';
import { cellUtils } from '../utils/cellUtils';
import { formulaUtils } from '../utils/formulaUtils';

// Define types
interface ICell {
  value: string | number | null;
  formula: string | null;
  format: string | null;
}

interface IWorksheet {
  id: string;
  name: string;
  cells: { [key: string]: ICell };
}

interface IWorkbook {
  id: string;
  name: string;
  sheets: IWorksheet[];
}

interface IExcelState {
  workbook: IWorkbook | null;
  activeSheet: IWorksheet | null;
  selectedCell: ICell | null;
  loading: boolean;
  error: string | null;
}

interface IExcelContext extends IExcelState {
  actions: {
    setWorkbook: (workbook: IWorkbook) => void;
    setActiveSheet: (sheet: IWorksheet) => void;
    setSelectedCell: (cell: ICell) => void;
    updateCell: (cellId: string, value: string | number) => void;
    addSheet: () => void;
    removeSheet: (sheetId: string) => void;
    saveWorkbook: () => Promise<void>;
  };
}

// Create the context
const ExcelContext = createContext<IExcelContext | undefined>(undefined);

// Define action types
type ExcelAction =
  | { type: 'SET_WORKBOOK'; payload: IWorkbook }
  | { type: 'SET_ACTIVE_SHEET'; payload: IWorksheet }
  | { type: 'SET_SELECTED_CELL'; payload: ICell }
  | { type: 'UPDATE_CELL'; payload: { cellId: string; value: string | number } }
  | { type: 'ADD_SHEET' }
  | { type: 'REMOVE_SHEET'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Define the reducer
const excelReducer = (state: IExcelState, action: ExcelAction): IExcelState => {
  switch (action.type) {
    case 'SET_WORKBOOK':
      return { ...state, workbook: action.payload, activeSheet: action.payload.sheets[0] };
    case 'SET_ACTIVE_SHEET':
      return { ...state, activeSheet: action.payload };
    case 'SET_SELECTED_CELL':
      return { ...state, selectedCell: action.payload };
    case 'UPDATE_CELL':
      if (!state.activeSheet) return state;
      const updatedCells = {
        ...state.activeSheet.cells,
        [action.payload.cellId]: {
          ...state.activeSheet.cells[action.payload.cellId],
          value: action.payload.value,
          formula: cellUtils.isFormula(action.payload.value.toString())
            ? action.payload.value.toString()
            : null,
        },
      };
      const updatedSheet = { ...state.activeSheet, cells: updatedCells };
      return {
        ...state,
        activeSheet: updatedSheet,
        workbook: state.workbook
          ? {
              ...state.workbook,
              sheets: state.workbook.sheets.map((sheet) =>
                sheet.id === updatedSheet.id ? updatedSheet : sheet
              ),
            }
          : null,
      };
    case 'ADD_SHEET':
      if (!state.workbook) return state;
      const newSheet: IWorksheet = {
        id: `sheet-${state.workbook.sheets.length + 1}`,
        name: `Sheet ${state.workbook.sheets.length + 1}`,
        cells: {},
      };
      return {
        ...state,
        workbook: { ...state.workbook, sheets: [...state.workbook.sheets, newSheet] },
        activeSheet: newSheet,
      };
    case 'REMOVE_SHEET':
      if (!state.workbook) return state;
      const updatedSheets = state.workbook.sheets.filter((sheet) => sheet.id !== action.payload);
      return {
        ...state,
        workbook: { ...state.workbook, sheets: updatedSheets },
        activeSheet: updatedSheets[0] || null,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Create the provider component
export const ExcelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(excelReducer, {
    workbook: null,
    activeSheet: null,
    selectedCell: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const autoSave = setInterval(() => {
      if (state.workbook) {
        saveWorkbook();
      }
    }, 60000); // Auto-save every minute

    return () => clearInterval(autoSave);
  }, [state.workbook]);

  const setWorkbook = (workbook: IWorkbook) => dispatch({ type: 'SET_WORKBOOK', payload: workbook });
  const setActiveSheet = (sheet: IWorksheet) => dispatch({ type: 'SET_ACTIVE_SHEET', payload: sheet });
  const setSelectedCell = (cell: ICell) => dispatch({ type: 'SET_SELECTED_CELL', payload: cell });
  const updateCell = (cellId: string, value: string | number) =>
    dispatch({ type: 'UPDATE_CELL', payload: { cellId, value } });
  const addSheet = () => dispatch({ type: 'ADD_SHEET' });
  const removeSheet = (sheetId: string) => dispatch({ type: 'REMOVE_SHEET', payload: sheetId });

  const saveWorkbook = async () => {
    if (!state.workbook) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.saveWorkbook(state.workbook);
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save workbook' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value: IExcelContext = {
    ...state,
    actions: {
      setWorkbook,
      setActiveSheet,
      setSelectedCell,
      updateCell,
      addSheet,
      removeSheet,
      saveWorkbook,
    },
  };

  return <ExcelContext.Provider value={value}>{children}</ExcelContext.Provider>;
};

// Create a custom hook for using the Excel context
export const useExcel = (): IExcelContext => {
  const context = useContext(ExcelContext);
  if (context === undefined) {
    throw new Error('useExcel must be used within an ExcelProvider');
  }
  return context;
};