import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { configureAxe } from 'jest-axe';
import '@testing-library/jest-dom/extend-expect';
import { setup } from '../setup';
import { Grid } from '../../frontend-web/src/components/Grid/Grid';
import { Ribbon } from '../../frontend-web/src/components/Ribbon/Ribbon';
import { FormulaBar } from '../../frontend-web/src/components/FormulaBar/FormulaBar';

// Configure axe for testing
const axeConfig = configureAxe({
  rules: [
    { id: 'color-contrast', enabled: true },
    { id: 'aria-roles', enabled: true },
    { id: 'aria-props', enabled: true },
    { id: 'aria-hidden-focus', enabled: true },
    { id: 'landmark-one-main', enabled: true },
  ],
});

// Helper function to run axe accessibility test
async function runAxeTest(component: React.ReactElement): Promise<void> {
  const { container } = render(component);
  const results = await axeConfig(container);
  
  expect(results).toHaveNoViolations();
}

describe('WCAG 2.1 Compliance Tests', () => {
  beforeAll(() => {
    setup(); // Configure the testing environment
  });

  test('Grid component should be WCAG 2.1 compliant', async () => {
    await runAxeTest(<Grid />);
  });

  test('Ribbon component should be WCAG 2.1 compliant', async () => {
    await runAxeTest(<Ribbon />);
  });

  test('FormulaBar component should be WCAG 2.1 compliant', async () => {
    await runAxeTest(<FormulaBar />);
  });

  test('Keyboard navigation should be possible', () => {
    render(<Grid />);
    const firstCell = screen.getByRole('gridcell', { name: /A1/i });
    firstCell.focus();
    expect(firstCell).toHaveFocus();

    // Simulate keyboard navigation
    firstCell.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    const secondCell = screen.getByRole('gridcell', { name: /B1/i });
    expect(secondCell).toHaveFocus();
  });

  test('All interactive elements should have accessible names', () => {
    render(<Ribbon />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });

  test('Color contrast should meet WCAG 2.1 requirements', async () => {
    const { container } = render(<FormulaBar />);
    const results = await axe.run(container, {
      rules: ['color-contrast'],
    });
    expect(results.violations).toHaveLength(0);
  });

  test('Zoom functionality should work without loss of content', () => {
    // This test is a placeholder and may require manual testing or more complex setup
    // to simulate browser zoom and check for content visibility
    console.warn('Zoom functionality test requires manual verification');
  });

  test('Screen reader compatibility for Grid component', () => {
    render(<Grid />);
    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-rowcount');
    expect(grid).toHaveAttribute('aria-colcount');
    
    const cells = screen.getAllByRole('gridcell');
    cells.forEach(cell => {
      expect(cell).toHaveAttribute('aria-rowindex');
      expect(cell).toHaveAttribute('aria-colindex');
    });
  });
});

// Human tasks:
// 1. Manually verify zoom functionality across different browsers and devices
// 2. Conduct user testing with individuals using various assistive technologies
// 3. Perform a comprehensive audit using professional accessibility tools
// 4. Review and update color schemes to ensure sufficient contrast ratios
// 5. Verify that all images and icons have appropriate alternative text