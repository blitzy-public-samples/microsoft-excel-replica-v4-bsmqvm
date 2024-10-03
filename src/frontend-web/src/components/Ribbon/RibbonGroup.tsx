import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Tooltip } from '@mui/material';
import { useExcel } from '../../context/ExcelContext';
import { IRibbonAction } from '../../types/excel';

// Styled components
const GroupContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRight: `1px solid ${theme.palette.divider}`,
  minWidth: '80px',
}));

const GroupTitle = styled(Box)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: theme.spacing(1),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: '60px',
  padding: theme.spacing(0.5),
  fontSize: '0.75rem',
  textTransform: 'none',
  lineHeight: 1.2,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface RibbonGroupProps {
  title: string;
  actions: IRibbonAction[];
}

export const RibbonGroup: React.FC<RibbonGroupProps> = ({ title, actions }) => {
  const { excelState, dispatch } = useExcel();

  const handleActionClick = (action: IRibbonAction) => {
    if (action.handler) {
      action.handler(excelState, dispatch);
    }
  };

  return (
    <GroupContainer>
      <GroupTitle>{title}</GroupTitle>
      {actions.map((action) => (
        <Tooltip key={action.id} title={action.tooltip || ''} arrow>
          <ActionButton
            onClick={() => handleActionClick(action)}
            disabled={action.isDisabled ? action.isDisabled(excelState) : false}
            aria-label={action.ariaLabel || action.label}
          >
            {action.icon && <span className={`icon ${action.icon}`} />}
            {action.label}
          </ActionButton>
        </Tooltip>
      ))}
    </GroupContainer>
  );
};

export default RibbonGroup;