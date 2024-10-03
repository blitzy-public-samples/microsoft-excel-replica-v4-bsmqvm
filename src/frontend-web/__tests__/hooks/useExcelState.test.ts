import { renderHook, act } from '@testing-library/react-hooks';
import { useExcelState } from '../../src/hooks/useExcelState';
import { updateCell } from '../../src/utils/cellUtils';
import { evaluateFormula } from '../../src/utils/formulaUtils';
import { api } from '../../src/services/api';
import { ExcelState, ExcelStateActions } from '../../src/types/excel';

// Mock dependencies
jest.mock('../../src/utils/cellUtils');
jest.mock('../../src/utils/formulaUtils');
jest.mock('../../src/services/api');

describe('useExcelState', () => {
  // Helper function to set up the test environment
  const setup = () => {
    return renderHook(() => useExcelState());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default state', () => {
    const { result } = setup();
    expect(result.current[0]).toEqual({
      workbooks: [],
      activeWorkbook: null,
      activeWorksheet: null,
      selectedCell: null,
      selectedRange: null,
      copiedData: null,
    });
  });

  test('should update cell value', async () => {
    const { result } = setup();
    const newValue = 'New Value';
    const cellId = 'A1';

    (updateCell as jest.Mock).mockResolvedValue({ id: cellId, value: newValue });

    await act(async () => {
      await result.current[1].updateCellValue(cellId, newValue);
    });

    expect(updateCell).toHaveBeenCalledWith(cellId, newValue);
    expect(result.current[0].activeWorksheet?.cells[cellId].value).toBe(newValue);
  });

  test('should select cell or range', () => {
    const { result } = setup();
    const cellId = 'B2';

    act(() => {
      result.current[1].selectCellOrRange(cellId);
    });

    expect(result.current[0].selectedCell).toBe(cellId);
    expect(result.current[0].selectedRange).toBeNull();

    const range = { start: 'B2', end: 'D4' };
    act(() => {
      result.current[1].selectCellOrRange(range);
    });

    expect(result.current[0].selectedCell).toBeNull();
    expect(result.current[0].selectedRange).toEqual(range);
  });

  test('should add new worksheet', async () => {
    const { result } = setup();
    const newWorksheet = { id: 'sheet2', name: 'Sheet 2', cells: {} };

    (api.addWorksheet as jest.Mock).mockResolvedValue(newWorksheet);

    await act(async () => {
      await result.current[1].addWorksheet('Sheet 2');
    });

    expect(api.addWorksheet).toHaveBeenCalledWith('Sheet 2');
    expect(result.current[0].activeWorkbook?.worksheets).toContainEqual(newWorksheet);
  });

  test('should delete worksheet', async () => {
    const { result } = setup();
    const worksheetId = 'sheet1';

    (api.deleteWorksheet as jest.Mock).mockResolvedValue(true);

    await act(async () => {
      await result.current[1].deleteWorksheet(worksheetId);
    });

    expect(api.deleteWorksheet).toHaveBeenCalledWith(worksheetId);
    expect(result.current[0].activeWorkbook?.worksheets.find(w => w.id === worksheetId)).toBeUndefined();
  });

  test('should copy selection', () => {
    const { result } = setup();
    const range = { start: 'A1', end: 'B2' };
    const copiedData = [['1', '2'], ['3', '4']];

    act(() => {
      result.current[1].copySelection(range);
    });

    expect(result.current[0].copiedData).toEqual(copiedData);
  });

  test('should paste selection', async () => {
    const { result } = setup();
    const targetCell = 'C3';
    const copiedData = [['1', '2'], ['3', '4']];

    (api.pasteData as jest.Mock).mockResolvedValue(true);

    await act(async () => {
      result.current[1].copySelection({ start: 'A1', end: 'B2' });
      await result.current[1].pasteSelection(targetCell);
    });

    expect(api.pasteData).toHaveBeenCalledWith(targetCell, copiedData);
    // Add assertions for updated state after pasting
  });

  test('should perform undo action', async () => {
    const { result } = setup();
    const previousState: ExcelState = {
      // ... previous state snapshot
    };

    (api.undo as jest.Mock).mockResolvedValue(previousState);

    await act(async () => {
      await result.current[1].undo();
    });

    expect(api.undo).toHaveBeenCalled();
    expect(result.current[0]).toEqual(previousState);
  });

  test('should perform redo action', async () => {
    const { result } = setup();
    const nextState: ExcelState = {
      // ... next state snapshot
    };

    (api.redo as jest.Mock).mockResolvedValue(nextState);

    await act(async () => {
      await result.current[1].redo();
    });

    expect(api.redo).toHaveBeenCalled();
    expect(result.current[0]).toEqual(nextState);
  });

  test('should handle formula evaluation', async () => {
    const { result } = setup();
    const cellId = 'A1';
    const formula = '=SUM(B1:B5)';
    const evaluatedValue = 15;

    (evaluateFormula as jest.Mock).mockResolvedValue(evaluatedValue);

    await act(async () => {
      await result.current[1].updateCellValue(cellId, formula);
    });

    expect(evaluateFormula).toHaveBeenCalledWith(formula, expect.any(Object));
    expect(result.current[0].activeWorksheet?.cells[cellId].value).toBe(evaluatedValue);
  });

  test('should synchronize state with backend', async () => {
    const { result } = setup();
    const updatedState: ExcelState = {
      // ... updated state from backend
    };

    (api.syncState as jest.Mock).mockResolvedValue(updatedState);

    await act(async () => {
      await result.current[1].syncWithBackend();
    });

    expect(api.syncState).toHaveBeenCalledWith(result.current[0]);
    expect(result.current[0]).toEqual(updatedState);
  });

  test('should optimize performance for large datasets', async () => {
    const { result } = setup();
    const largeDataset = {
      // ... large initial dataset
    };

    jest.useFakeTimers();

    act(() => {
      result.current[1].loadLargeDataset(largeDataset);
    });

    // Simulate multiple state updates
    for (let i = 0; i < 1000; i++) {
      act(() => {
        result.current[1].updateCellValue(`A${i}`, `Value ${i}`);
      });
    }

    // Fast-forward timers
    jest.runAllTimers();

    // Assert that updates are batched and optimized
    expect(api.batchUpdate).toHaveBeenCalled();
    // Add more specific assertions based on your batching logic

    jest.useRealTimers();
  });
});