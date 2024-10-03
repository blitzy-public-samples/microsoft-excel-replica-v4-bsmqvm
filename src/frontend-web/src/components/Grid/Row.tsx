import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Cell } from './Cell';
import { useExcelState } from '../../hooks/useExcelState';

interface RowProps {
  rowIndex: number;
}

const StyledRow = styled.div`
  display: flex;
  height: 25px; // Default row height, can be adjusted
`;

export const Row: React.FC<RowProps> = React.memo(({ rowIndex }) => {
  const { getColumnCount, getCellValue, isRowSelected, getRowHeight } = useExcelState();

  const columnCount = useMemo(() => getColumnCount(), [getColumnCount]);
  const rowHeight = useMemo(() => getRowHeight(rowIndex), [getRowHeight, rowIndex]);

  const cells = useMemo(() => {
    return Array.from({ length: columnCount }, (_, columnIndex) => (
      <Cell
        key={`${rowIndex}-${columnIndex}`}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        value={getCellValue(rowIndex, columnIndex)}
      />
    ));
  }, [rowIndex, columnCount, getCellValue]);

  return (
    <StyledRow
      style={{ height: `${rowHeight}px` }}
      data-row-index={rowIndex}
      data-selected={isRowSelected(rowIndex)}
    >
      {cells}
    </StyledRow>
  );
});

Row.displayName = 'Row';

export default Row;