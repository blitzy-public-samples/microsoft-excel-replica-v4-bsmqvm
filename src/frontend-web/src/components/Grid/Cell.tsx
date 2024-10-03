import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { CellType } from '../../types/excel';
import { useExcelState } from '../../hooks/useExcelState';
import { getCellValue, setCellValue, formatCellValue } from '../../utils/cellUtils';

interface CellProps {
  rowIndex: number;
  columnIndex: number;
}

const StyledCell = styled.div<{ isActive: boolean; conditionalFormatting: any }>`
  border: 1px solid #e0e0e0;
  padding: 4px;
  min-width: 80px;
  height: 24px;
  background-color: ${props => props.isActive ? '#e6f2ff' : 'white'};
  ${props => props.conditionalFormatting}
`;

const CellInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
`;

export const Cell: React.FC<CellProps> = ({ rowIndex, columnIndex }) => {
  const { excelState, setExcelState } = useExcelState();
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState('');
  const [conditionalFormatting, setConditionalFormatting] = useState({});

  const cellKey = `${rowIndex},${columnIndex}`;
  const isActiveCell = excelState.activeCell === cellKey;

  useEffect(() => {
    const value = getCellValue(excelState, rowIndex, columnIndex);
    setCellValue(formatCellValue(value));
    updateConditionalFormatting(value);
  }, [excelState, rowIndex, columnIndex]);

  const updateConditionalFormatting = (value: CellType) => {
    // Implement conditional formatting logic here
    // This is a placeholder implementation
    const formatting = value && typeof value === 'number' && value < 0
      ? { color: 'red' }
      : {};
    setConditionalFormatting(formatting);
  };

  const handleCellClick = useCallback(() => {
    setExcelState(prevState => ({
      ...prevState,
      activeCell: cellKey
    }));
  }, [setExcelState, cellKey]);

  const handleCellDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCellChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCellValue(newValue);
  }, []);

  const handleCellBlur = useCallback(() => {
    setIsEditing(false);
    setExcelState(prevState => ({
      ...prevState,
      data: setCellValue(prevState, rowIndex, columnIndex, cellValue)
    }));
  }, [setExcelState, rowIndex, columnIndex, cellValue]);

  return (
    <StyledCell
      isActive={isActiveCell}
      conditionalFormatting={conditionalFormatting}
      onClick={handleCellClick}
      onDoubleClick={handleCellDoubleClick}
    >
      {isEditing ? (
        <CellInput
          value={cellValue}
          onChange={handleCellChange}
          onBlur={handleCellBlur}
          autoFocus
        />
      ) : (
        cellValue
      )}
    </StyledCell>
  );
};