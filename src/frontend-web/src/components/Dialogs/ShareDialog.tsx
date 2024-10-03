import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useExcel } from '../../context/ExcelContext';
import { shareWorkbook } from '../../services/api';
import { IWorkbook, IUser } from '../../types/excel';
import { generateShareLink } from '../../utils/sharingUtils';

// Styled components for consistent appearance
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  workbook: IWorkbook;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, workbook }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [permissionLevel, setPermissionLevel] = useState('view');
  const [shareLink, setShareLink] = useState('');
  const [error, setError] = useState('');
  const { user } = useExcel();

  useEffect(() => {
    if (open) {
      setShareLink(generateShareLink(workbook.id));
    }
  }, [open, workbook.id]);

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleShare = async () => {
    if (!validateEmail(recipientEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await shareWorkbook(workbook.id, recipientEmail, permissionLevel);
      onClose();
    } catch (err) {
      setError('An error occurred while sharing the workbook. Please try again.');
    }
  };

  const handleGenerateLink = () => {
    const newShareLink = generateShareLink(workbook.id, permissionLevel);
    setShareLink(newShareLink);
  };

  return (
    <StyledDialog open={open} onClose={onClose} aria-labelledby="share-dialog-title">
      <DialogTitle id="share-dialog-title">Share Workbook</DialogTitle>
      <DialogContent>
        <StyledTextField
          autoFocus
          margin="dense"
          id="recipient-email"
          label="Recipient Email"
          type="email"
          fullWidth
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Select
          value={permissionLevel}
          onChange={(e) => setPermissionLevel(e.target.value as string)}
          fullWidth
          margin="dense"
        >
          <MenuItem value="view">View</MenuItem>
          <MenuItem value="edit">Edit</MenuItem>
          <MenuItem value="comment">Comment</MenuItem>
        </Select>
        <StyledTextField
          margin="dense"
          id="share-link"
          label="Share Link"
          type="text"
          fullWidth
          value={shareLink}
          InputProps={{
            readOnly: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleGenerateLink} color="primary">
          Generate Link
        </Button>
        <Button onClick={handleShare} color="primary" variant="contained">
          Share
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ShareDialog;