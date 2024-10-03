import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Cell } from './Cell';
import { useExcelState } from '../../hooks/useExcelState';
import { EXCEL_COLUMN_LETTERS } from '../../constants/ExcelConstants';

interface ColumnProps {
  columnIndex: number;
}

const ColumnContainer = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  background-color: ${props => props.isSelected ? '#e6f2ff' : 'transparent'};
`;

const ColumnHeader = styled.div`
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
`;

export const Column: React.FC<ColumnProps> = React.memo(({ columnIndex }) => {
  const { 
    excelState, 
    actions, 
    visibleRows, 
    isColumnSelected, 
    getColumnWidth 
  } = useExcelState();

  const columnLetter = EXCEL_COLUMN_LETTERS[columnIndex];
  const isSelected = isColumnSelected(columnIndex);
  const columnWidth = getColumnWidth(columnIndex);

  const handleColumnClick = () => {
    actions.selectColumn(columnIndex);
  };

  const handleColumnDoubleClick = () => {
    actions.autoResizeColumn(columnIndex);
  };

  const memoizedCells = useMemo(() => {
    return visibleRows.map((rowIndex) => (
      <Cell
        key={`${columnIndex}-${rowIndex}`}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
      />
    ));
  }, [columnIndex, visibleRows]);

  return (
    <ColumnContainer isSelected={isSelected} style={{ width: columnWidth }}>
      <ColumnHeader
        onClick={handleColumnClick}
        onDoubleClick={handleColumnDoubleClick}
      >
        {columnLetter}
      </ColumnHeader>
      {memoizedCells}
    </ColumnContainer>
  );
});

Column.displayName = 'Column';