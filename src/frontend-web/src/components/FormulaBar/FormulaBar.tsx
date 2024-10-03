import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// Assuming the structure of the ExcelContext
interface ExcelContextType {
  selectedCell: ICell | null;
  updateCellValue: (cell: ICell, value: string) => void;
}

// Assuming the structure of ICell
interface ICell {
  id: string;
  value: string;
  formula: string;
}

// Assuming the structure of the useExcel hook
const useExcel = (): ExcelContextType => {
  // This is a mock implementation
  const [selectedCell, setSelectedCell] = useState<ICell | null>(null);
  const updateCellValue = (cell: ICell, value: string) => {
    console.log('Updating cell:', cell, 'with value:', value);
  };
  return { selectedCell, updateCellValue };
};

// Assuming the structure of the parseFormula function
const parseFormula = (formula: string): string => {
  // This is a mock implementation
  return formula;
};

const StyledFormulaBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiInputBase-input': {
    fontFamily: 'monospace',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

export const FormulaBar: React.FC = () => {
  const { selectedCell, updateCellValue } = useExcel();
  const [formula, setFormula] = useState<string>('');

  useEffect(() => {
    if (selectedCell) {
      setFormula(selectedCell.formula || selectedCell.value);
    } else {
      setFormula('');
    }
  }, [selectedCell]);

  const handleFormulaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormula(event.target.value);
  };

  const handleFormulaSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && selectedCell) {
      try {
        const parsedFormula = parseFormula(formula);
        updateCellValue(selectedCell, parsedFormula);
      } catch (error) {
        console.error('Error parsing formula:', error);
        // TODO: Implement error handling for formula parsing issues
      }
    }
  };

  return (
    <StyledFormulaBar>
      <StyledTextField
        value={formula}
        onChange={handleFormulaChange}
        onKeyPress={handleFormulaSubmit}
        placeholder="Enter formula or value"
        fullWidth
        variant="outlined"
        size="small"
        inputProps={{
          'aria-label': 'Formula input',
        }}
      />
    </StyledFormulaBar>
  );
};

export default FormulaBar;