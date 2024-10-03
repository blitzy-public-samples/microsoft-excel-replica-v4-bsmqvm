import React, { useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import RibbonGroup from './RibbonGroup';
import { useExcel } from '../../context/ExcelContext';
import { IRibbonTab } from '../../types/excel';

// Styled component for the tab
const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: 120,
  minHeight: 48,
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '@media (max-width: 600px)': {
    minWidth: 80,
    fontSize: '12px',
  },
}));

// Props interface for the RibbonTab component
interface RibbonTabProps extends IRibbonTab {
  index: number;
  selectedTab: number;
  onSelectTab: (index: number) => void;
}

const RibbonTab: React.FC<RibbonTabProps> = ({
  label,
  groups,
  isActive,
  index,
  selectedTab,
  onSelectTab,
}) => {
  const { dispatch } = useExcel();

  // Memoize the tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    return (
      <>
        {isActive && groups.map((group, groupIndex) => (
          <RibbonGroup
            key={`${label}-group-${groupIndex}`}
            {...group}
          />
        ))}
      </>
    );
  }, [isActive, groups, label]);

  // Handle tab click
  const handleTabClick = useCallback(() => {
    onSelectTab(index);
    dispatch({ type: 'SET_ACTIVE_TAB', payload: index });
  }, [index, onSelectTab, dispatch]);

  return (
    <>
      <StyledTab
        label={label}
        onClick={handleTabClick}
        aria-selected={selectedTab === index}
        aria-controls={`ribbon-tabpanel-${index}`}
        id={`ribbon-tab-${index}`}
        role="tab"
      />
      {selectedTab === index && (
        <div
          role="tabpanel"
          hidden={selectedTab !== index}
          id={`ribbon-tabpanel-${index}`}
          aria-labelledby={`ribbon-tab-${index}`}
        >
          {tabContent}
        </div>
      )}
    </>
  );
};

export default React.memo(RibbonTab);