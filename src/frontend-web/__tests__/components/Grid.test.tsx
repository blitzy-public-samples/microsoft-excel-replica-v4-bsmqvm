import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Grid } from '../../src/components/Grid/Grid';
import { useExcelState } from '../../src/hooks/useExcelState';
import { ExcelContext } from '../../src/context/ExcelContext';

// Mock the useExcelState hook
jest.mock('../../src/hooks/useExcelState');

describe('Grid component', () => {
  const mockExcelState = {
    cells: {
      'A1': { value: 'Test', formula: '=TEST', style: {} },
      'B1': { value: 123, formula: '', style: {} },
    },
    activeCell: 'A1',
    setActiveCell: jest.fn(),
    updateCell: jest.fn(),
  };

  beforeEach(() => {
    (useExcelState as jest.Mock).mockReturnValue(mockExcelState);
  });

  test('renders correct number of rows and columns', () => {
    const { container } = render(
      <ExcelContext.Provider value={mockExcelState}>
        <Grid rows={10} columns={5} />
      </ExcelContext.Provider>
    );

    const rows = container.querySelectorAll('.grid-row');
    const cells = container.querySelectorAll('.grid-cell');

    expect(rows).toHaveLength(10);
    expect(cells).toHaveLength(50); // 10 rows * 5 columns
  });

  test('handles cell selection', () => {
    const { getByTestId } = render(
      <ExcelContext.Provider value={mockExcelState}>
        <Grid rows={10} columns={5} />
      </ExcelContext.Provider>
    );

    const cellB2 = getByTestId('cell-B2');
    fireEvent.click(cellB2);

    expect(mockExcelState.setActiveCell).toHaveBeenCalledWith('B2');
  });

  test('supports keyboard navigation', () => {
    const { getByTestId } = render(
      <ExcelContext.Provider value={mockExcelState}>
        <Grid rows={10} columns={5} />
      </ExcelContext.Provider>
    );

    const cellA1 = getByTestId('cell-A1');
    fireEvent.keyDown(cellA1, { key: 'ArrowRight' });
    expect(mockExcelState.setActiveCell).toHaveBeenCalledWith('B1');

    fireEvent.keyDown(cellA1, { key: 'ArrowDown' });
    expect(mockExcelState.setActiveCell).toHaveBeenCalledWith('A2');

    fireEvent.keyDown(cellA1, { key: 'Tab' });
    expect(mockExcelState.setActiveCell).toHaveBeenCalledWith('B1');

    fireEvent.keyDown(cellA1, { key: 'Enter' });
    expect(mockExcelState.setActiveCell).toHaveBeenCalledWith('A2');
  });

  test('updates cell value on input', async () => {
    const { getByTestId } = render(
      <ExcelContext.Provider value={mockExcelState}>
        <Grid rows={10} columns={5} />
      </ExcelContext.Provider>
    );

    const cellA1 = getByTestId('cell-A1');
    fireEvent.doubleClick(cellA1);

    const input = getByTestId('cell-input-A1');
    fireEvent.change(input, { target: { value: 'New Value' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockExcelState.updateCell).toHaveBeenCalledWith('A1', 'New Value');
    });
  });

  test('displays cell values and formulas correctly', () => {
    const { getByTestId } = render(
      <ExcelContext.Provider value={mockExcelState}>
        <Grid rows={10} columns={5} />
      </ExcelContext.Provider>
    );

    const cellA1 = getByTestId('cell-A1');
    const cellB1 = getByTestId('cell-B1');

    expect(cellA1).toHaveTextContent('Test');
    expect(cellB1).toHaveTextContent('123');

    fireEvent.doubleClick(cellA1);
    const inputA1 = getByTestId('cell-input-A1');
    expect(inputA1).toHaveValue('=TEST');
  });

  test('applies cell styles', () => {
    const styledMockExcelState = {
      ...mockExcelState,
      cells: {
        ...mockExcelState.cells,
        'A1': { ...mockExcelState.cells['A1'], style: { fontWeight: 'bold', color: 'red' } },
      },
    };

    (useExcelState as jest.Mock).mockReturnValue(styledMockExcelState);

    const { getByTestId } = render(
      <ExcelContext.Provider value={styledMockExcelState}>
        <Grid rows={10} columns={5} />
      </ExcelContext.Provider>
    );

    const cellA1 = getByTestId('cell-A1');
    expect(cellA1).toHaveStyle('font-weight: bold; color: red;');
  });
});