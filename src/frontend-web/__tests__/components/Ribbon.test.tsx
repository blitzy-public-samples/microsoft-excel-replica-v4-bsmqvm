import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, it } from '@jest/globals';
import Ribbon from '../../src/components/Ribbon/Ribbon';
import { ExcelContext } from '../../src/context/ExcelContext';

// Mock ExcelContext provider
const MockContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockContextValue = {
    // Add mock values and functions as needed
    activeWorkbook: {
      sheets: ['Sheet1', 'Sheet2'],
      activeSheet: 'Sheet1',
    },
    setActiveSheet: jest.fn(),
    // Add other necessary context values and functions
  };

  return (
    <ExcelContext.Provider value={mockContextValue}>
      {children}
    </ExcelContext.Provider>
  );
};

describe('Ribbon Component', () => {
  const renderRibbon = () => {
    return render(
      <MockContextProvider>
        <Ribbon />
      </MockContextProvider>
    );
  };

  it('renders without crashing', () => {
    renderRibbon();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays all expected tabs', () => {
    renderRibbon();
    const expectedTabs = ['Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'];
    expectedTabs.forEach(tab => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });

  it('switches active tab on click', () => {
    renderRibbon();
    const insertTab = screen.getByText('Insert');
    fireEvent.click(insertTab);
    expect(insertTab).toHaveClass('active'); // Assuming 'active' class for the active tab
  });

  it('renders ribbon groups within active tab', () => {
    renderRibbon();
    const homeTab = screen.getByText('Home');
    fireEvent.click(homeTab);
    expect(screen.getByText('Clipboard')).toBeInTheDocument();
    expect(screen.getByText('Font')).toBeInTheDocument();
    // Add more assertions for other ribbon groups in the Home tab
  });

  it('disables certain options based on workbook state', () => {
    renderRibbon();
    // Assuming there's a 'Paste' button that should be disabled when clipboard is empty
    const pasteButton = screen.getByText('Paste');
    expect(pasteButton).toBeDisabled();
  });

  it('triggers correct actions on button clicks', () => {
    const { getByText } = renderRibbon();
    const boldButton = getByText('Bold');
    fireEvent.click(boldButton);
    // Add assertions to check if the bold action was triggered in the Excel context
  });

  it('is keyboard navigable', () => {
    renderRibbon();
    const firstTab = screen.getByText('Home');
    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(screen.getByText('Insert')).toHaveFocus();
  });

  it('applies correct styling based on theme', () => {
    renderRibbon();
    const ribbon = screen.getByRole('navigation');
    // Add assertions to check if the ribbon has the correct theme-based styling
    expect(ribbon).toHaveStyle({ /* add expected styles */ });
  });

  it('adapts layout for different screen sizes', () => {
    // This test might require adjusting the viewport size
    // and checking if the ribbon layout changes accordingly
  });

  it('renders with correct ARIA attributes', () => {
    renderRibbon();
    const ribbon = screen.getByRole('navigation');
    expect(ribbon).toHaveAttribute('aria-label', 'Excel Ribbon');
    // Add more assertions for other ARIA attributes
  });
});