import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Cell } from '../Cell/Cell';
import { Row } from '../Row/Row';
import { Column } from '../Column/Column';
import { useExcelState } from '../../hooks/useExcelState';
import { ExcelContext } from '../../context/ExcelContext';
import * as cellUtils from '../../utils/cellUtils';

interface GridProps {
  rowCount: number;
  columnCount: number;
}

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
  width: 100%;
`;

const GridContent = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columnCount}, 1fr);
`;

export const Grid: React.FC<GridProps> = ({ rowCount, columnCount }) => {
  const { state, dispatch } = useExcelState();
  const [activeCell, setActiveCell] = useState<string | null>(null);

  useEffect(() => {
    // Initialize grid state
    dispatch({ type: 'INITIALIZE_GRID', payload: { rowCount, columnCount } });
  }, [rowCount, columnCount, dispatch]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (activeCell) {
      const { key } = event;
      const [row, col] = cellUtils.cellToRowCol(activeCell);

      switch (key) {
        case 'ArrowUp':
          setActiveCell(cellUtils.rowColToCell(Math.max(0, row - 1), col));
          break;
        case 'ArrowDown':
          setActiveCell(cellUtils.rowColToCell(Math.min(rowCount - 1, row + 1), col));
          break;
        case 'ArrowLeft':
          setActiveCell(cellUtils.rowColToCell(row, Math.max(0, col - 1)));
          break;
        case 'ArrowRight':
          setActiveCell(cellUtils.rowColToCell(row, Math.min(columnCount - 1, col + 1)));
          break;
        case 'Enter':
          // TODO: Implement enter key behavior (e.g., move to next row)
          break;
        case 'Tab':
          event.preventDefault();
          // TODO: Implement tab key behavior (e.g., move to next column)
          break;
        default:
          break;
      }
    }
  }, [activeCell, rowCount, columnCount]);

  const handleGridClick = useCallback((event: React.MouseEvent) => {
    const cellElement = (event.target as HTMLElement).closest('[data-cell-id]');
    if (cellElement) {
      const cellId = cellElement.getAttribute('data-cell-id');
      setActiveCell(cellId);
      dispatch({ type: 'SET_ACTIVE_CELL', payload: cellId });
    }
  }, [dispatch]);

  return (
    <ExcelContext.Provider value={{ state, dispatch }}>
      <GridContainer onKeyDown={handleKeyDown} onClick={handleGridClick} tabIndex={0}>
        <GridContent columnCount={columnCount}>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <Row key={`row-${rowIndex}`}>
              {Array.from({ length: columnCount }).map((_, colIndex) => {
                const cellId = cellUtils.rowColToCell(rowIndex, colIndex);
                return (
                  <Cell
                    key={cellId}
                    cellId={cellId}
                    isActive={cellId === activeCell}
                    value={state.cells[cellId]?.value || ''}
                  />
                );
              })}
            </Row>
          ))}
        </GridContent>
      </GridContainer>
    </ExcelContext.Provider>
  );
};

// Implement virtualization for efficient rendering of large datasets
const VirtualizedGrid: React.FC<GridProps> = React.memo(({ rowCount, columnCount }) => {
  // TODO: Implement virtualization logic here
  return <Grid rowCount={rowCount} columnCount={columnCount} />;
});

export default VirtualizedGrid;