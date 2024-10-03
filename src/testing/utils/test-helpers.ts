import { MockDataGenerator } from './mock-data-generator';
import { render, RenderResult, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Workbook, Worksheet, Cell } from '../../shared/types';
import { MockWorkbookOptions, MockWorksheetOptions, MockCellOptions, TestEnvironmentOptions } from '../../shared/interfaces';

/**
 * Creates a mock workbook for testing purposes.
 * @param options Options to customize the mock workbook
 * @returns A mock workbook object
 */
export function createMockWorkbook(options: MockWorkbookOptions): Workbook {
  const workbook: Workbook = {
    id: options.id || MockDataGenerator.generateId(),
    name: options.name || 'Mock Workbook',
    sheets: [],
    // Add other properties as needed
  };

  // Apply the provided options to customize the workbook
  Object.assign(workbook, options);

  return workbook;
}

/**
 * Creates a mock worksheet for testing purposes.
 * @param options Options to customize the mock worksheet
 * @returns A mock worksheet object
 */
export function createMockWorksheet(options: MockWorksheetOptions): Worksheet {
  const worksheet: Worksheet = {
    id: options.id || MockDataGenerator.generateId(),
    name: options.name || 'Mock Worksheet',
    cells: {},
    // Add other properties as needed
  };

  // Apply the provided options to customize the worksheet
  Object.assign(worksheet, options);

  return worksheet;
}

/**
 * Creates a mock cell for testing purposes.
 * @param options Options to customize the mock cell
 * @returns A mock cell object
 */
export function createMockCell(options: MockCellOptions): Cell {
  const cell: Cell = {
    id: options.id || MockDataGenerator.generateId(),
    value: options.value || '',
    formula: options.formula || '',
    // Add other properties as needed
  };

  // Apply the provided options to customize the cell
  Object.assign(cell, options);

  return cell;
}

/**
 * Renders a React component with necessary providers for testing.
 * @param ui The React component to render
 * @param options Additional render options
 * @returns The result of rendering the component
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  const AllTheProviders: React.FC = ({ children }) => {
    // Add necessary providers here, e.g.:
    // return (
    //   <ThemeProvider theme={theme}>
    //     <LocalizationProvider>
    //       {children}
    //     </LocalizationProvider>
    //   </ThemeProvider>
    // );
    return <>{children}</>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Mocks an API call with optional delay.
 * @param mockData The data to be returned by the mocked API call
 * @param delay The delay in milliseconds before resolving the promise
 * @returns A promise that resolves with the mock data
 */
export function mockAPICall<T>(mockData: T, delay: number = 100): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, delay);
  });
}

/**
 * Sets up the test environment with necessary mocks and configurations.
 * @param options Options for setting up the test environment
 */
export function setupTestEnvironment(options: TestEnvironmentOptions): void {
  // Configure global mocks
  if (options.mockWindow) {
    // Mock window object
    Object.defineProperty(global, 'window', {
      value: {
        // Add mocked window properties and methods
      },
      writable: true,
    });
  }

  if (options.mockDocument) {
    // Mock document object
    Object.defineProperty(global, 'document', {
      value: {
        // Add mocked document properties and methods
      },
      writable: true,
    });
  }

  // Set up fake timers if needed
  if (options.useFakeTimers) {
    jest.useFakeTimers();
  }

  // Configure global test behaviors based on options
  if (options.suppressConsoleErrors) {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  }

  // Set up any necessary spies or mock implementations
  // Example: jest.spyOn(SomeModule, 'someMethod').mockImplementation(() => {});

  // Add more setup steps as needed
}

// Export types from testing-library for convenience
export { RenderResult, RenderOptions };

// Export userEvent for convenience
export { userEvent };