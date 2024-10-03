import React, { useState, useCallback, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Grid } from '../Grid/Grid';
import { useExcelState } from '../../hooks/useExcelState';
import { ExcelContext } from '../../context/ExcelContext';
import * as cellUtils from '../../utils/cellUtils';
import { ChartContainer } from '../Charts/ChartContainer';

interface SheetProps {
  id: string;
  name: string;
}

const SheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const SheetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f0f0f0;
`;

const SheetName = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const SheetContent = styled.div`
  flex: 1;
  overflow: auto;
`;

export const Sheet: React.FC<SheetProps> = ({ id, name }) => {
  const [sheetState, setSheetState] = useExcelState(id);
  const { excelData, updateExcelData } = useContext(ExcelContext);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);

  useEffect(() => {
    // Initialize sheet-specific data or fetch from ExcelContext
    // This is a placeholder and should be implemented based on your data structure
    if (!sheetState) {
      setSheetState({
        cells: {},
        charts: [],
        // Add other sheet-specific properties as needed
      });
    }
  }, [id, setSheetState, sheetState]);

  const handleSheetRename = useCallback((newName: string) => {
    if (newName.trim() !== '' && newName !== name) {
      updateExcelData((prevData) => ({
        ...prevData,
        sheets: prevData.sheets.map((sheet) =>
          sheet.id === id ? { ...sheet, name: newName } : sheet
        ),
      }));
      setIsRenaming(false);
    }
  }, [id, name, updateExcelData]);

  const handleSheetOperation = useCallback((operation: string, index: number) => {
    // Implement sheet operations like insert/delete rows/columns
    // This is a placeholder and should be implemented based on your requirements
    console.log(`Sheet operation: ${operation} at index ${index}`);
    // Update the sheet state accordingly
  }, []);

  const renderCharts = useCallback(() => {
    if (!sheetState || !sheetState.charts) return null;
    return sheetState.charts.map((chart) => (
      <ChartContainer key={chart.id} chartData={chart} />
    ));
  }, [sheetState]);

  if (!sheetState) {
    return <div>Loading...</div>;
  }

  return (
    <SheetContainer>
      <SheetHeader>
        {isRenaming ? (
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => handleSheetRename(newName)}
            onKeyPress={(e) => e.key === 'Enter' && handleSheetRename(newName)}
            autoFocus
          />
        ) : (
          <SheetName onDoubleClick={() => setIsRenaming(true)}>{name}</SheetName>
        )}
        {/* Add sheet operation buttons here */}
      </SheetHeader>
      <SheetContent>
        <Grid
          data={sheetState.cells}
          onCellChange={(cellId, value) => {
            setSheetState((prevState) => ({
              ...prevState,
              cells: {
                ...prevState.cells,
                [cellId]: { ...prevState.cells[cellId], value },
              },
            }));
          }}
          onCellFormat={(cellId, format) => {
            setSheetState((prevState) => ({
              ...prevState,
              cells: {
                ...prevState.cells,
                [cellId]: { ...prevState.cells[cellId], format },
              },
            }));
          }}
        />
        {renderCharts()}
      </SheetContent>
    </SheetContainer>
  );
};

// Implement performance optimizations
export const MemoizedSheet = React.memo(Sheet);