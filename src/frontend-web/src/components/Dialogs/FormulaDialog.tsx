import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useExcel } from '../../context/ExcelContext';
import { parseFormula } from '../../utils/formulaUtils';
import { IFormula } from '../../types/excel';

interface FormulaDialogProps {
  open: boolean;
  onClose: () => void;
  initialFormula: string;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontFamily: 'Consolas, monospace',
    fontSize: '14px',
  },
}));

export const FormulaDialog: React.FC<FormulaDialogProps> = ({ open, onClose, initialFormula }) => {
  const [formula, setFormula] = useState(initialFormula);
  const [error, setError] = useState<string | null>(null);
  const { updateCellFormula } = useExcel();

  useEffect(() => {
    setFormula(initialFormula);
    setError(null);
  }, [initialFormula]);

  const handleFormulaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormula(event.target.value);
    setError(null);
  };

  const handleSubmit = () => {
    try {
      const parsedFormula: IFormula = parseFormula(formula);
      updateCellFormula(parsedFormula);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} aria-labelledby="formula-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="formula-dialog-title">Edit Formula</DialogTitle>
      <DialogContent>
        <StyledTextField
          autoFocus
          margin="dense"
          id="formula"
          label="Formula"
          type="text"
          fullWidth
          variant="outlined"
          value={formula}
          onChange={handleFormulaChange}
          error={!!error}
          helperText={error}
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};