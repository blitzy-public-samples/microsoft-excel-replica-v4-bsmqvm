import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useExcelState } from '../../hooks/useExcelState';
import { ExcelContext } from '../../context/ExcelContext';
import * as sheetUtils from '../../utils/sheetUtils';

interface SheetTabProps {
  isActive: boolean;
}

const SheetTabsContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  border-top: 1px solid #ccc;
  padding: 4px 8px;
`;

const SheetTab = styled.div<SheetTabProps>`
  padding: 6px 12px;
  margin-right: 4px;
  border: 1px solid #ccc;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? '#fff' : '#e6e6e6')};
  font-weight: ${(props) => (props.isActive ? 'bold' : 'normal')};

  &:hover {
    background-color: ${(props) => (props.isActive ? '#fff' : '#f0f0f0')};
  }
`;

const AddSheetButton = styled.button`
  padding: 6px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #45a049;
  }
`;

export const SheetTabs: React.FC = () => {
  const { workbook, setActiveSheet, addSheet, renameSheet, deleteSheet } = useExcelState();
  const [sheets, setSheets] = useState(workbook.sheets);
  const [activeSheetId, setActiveSheetId] = useState(workbook.activeSheetId);

  useEffect(() => {
    setSheets(workbook.sheets);
    setActiveSheetId(workbook.activeSheetId);
  }, [workbook]);

  const handleSheetClick = useCallback((sheetId: string) => {
    setActiveSheet(sheetId);
  }, [setActiveSheet]);

  const handleAddSheet = useCallback(() => {
    const newSheet = addSheet();
    setActiveSheet(newSheet.id);
  }, [addSheet, setActiveSheet]);

  const handleRenameSheet = useCallback((sheetId: string, newName: string) => {
    renameSheet(sheetId, newName);
  }, [renameSheet]);

  const handleDeleteSheet = useCallback((sheetId: string) => {
    if (sheets.length > 1) {
      deleteSheet(sheetId);
    } else {
      alert('Cannot delete the last sheet.');
    }
  }, [sheets, deleteSheet]);

  return (
    <ExcelContext.Consumer>
      {(context) => (
        <SheetTabsContainer>
          {sheets.map((sheet) => (
            <SheetTab
              key={sheet.id}
              isActive={sheet.id === activeSheetId}
              onClick={() => handleSheetClick(sheet.id)}
              onDoubleClick={() => {
                const newName = prompt('Enter new sheet name:', sheet.name);
                if (newName) handleRenameSheet(sheet.id, newName);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                if (window.confirm(`Delete sheet "${sheet.name}"?`)) {
                  handleDeleteSheet(sheet.id);
                }
              }}
            >
              {sheet.name}
            </SheetTab>
          ))}
          <AddSheetButton onClick={handleAddSheet}>+</AddSheetButton>
        </SheetTabsContainer>
      )}
    </ExcelContext.Consumer>
  );
};

export default SheetTabs;