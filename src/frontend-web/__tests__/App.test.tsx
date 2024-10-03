import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExcelProvider } from '../src/context/ExcelContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import App from '../src/App';
import * as api from '../src/services/api';
import * as auth from '../src/services/auth';

// Mock the API and auth services
jest.mock('../src/services/api');
jest.mock('../src/services/auth');

// Helper function to render the App component with necessary providers
const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  return render(
    <ExcelProvider>
      <ThemeProvider>{ui}</ThemeProvider>
    </ExcelProvider>,
    options
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
  });

  test('displays main components', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('ribbon')).toBeInTheDocument();
    expect(screen.getByTestId('formula-bar')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-tabs')).toBeInTheDocument();
  });

  test('handles theme switching', async () => {
    renderWithProviders(<App />);
    const themeToggle = screen.getByTestId('theme-toggle');
    
    expect(document.body).toHaveClass('light-theme');
    
    userEvent.click(themeToggle);
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-theme');
    });
    
    userEvent.click(themeToggle);
    await waitFor(() => {
      expect(document.body).toHaveClass('light-theme');
    });
  });

  test('responds to user interactions', async () => {
    renderWithProviders(<App />);
    const cell = screen.getByTestId('cell-A1');
    const formulaBar = screen.getByTestId('formula-bar-input');
    
    userEvent.click(cell);
    expect(cell).toHaveClass('selected');
    
    userEvent.type(formulaBar, '=SUM(1,2)');
    userEvent.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(cell).toHaveTextContent('3');
    });
  });

  test('displays loading state while fetching initial data', async () => {
    (api.fetchInitialData as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    renderWithProviders(<App />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('handles and displays error states appropriately', async () => {
    (api.fetchInitialData as jest.Mock).mockRejectedValue(new Error('Failed to fetch data'));
    
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to fetch data');
    });
  });

  test('integrates correctly with ExcelContext', async () => {
    const mockWorkbook = { sheets: [{ name: 'Sheet1', cells: {} }] };
    (api.fetchInitialData as jest.Mock).mockResolvedValue(mockWorkbook);
    
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Sheet1')).toBeInTheDocument();
    });
  });

  test('responds to authentication state changes', async () => {
    (auth.isAuthenticated as jest.Mock).mockReturnValue(false);
    
    renderWithProviders(<App />);
    
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    
    (auth.isAuthenticated as jest.Mock).mockReturnValue(true);
    (auth.getCurrentUser as jest.Mock).mockReturnValue({ name: 'John Doe' });
    
    userEvent.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
    });
  });
});

describe('Accessibility Tests', () => {
  test('proper heading structure is maintained', () => {
    renderWithProviders(<App />);
    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveAttribute('aria-level', '1');
  });

  test('all interactive elements are keyboard accessible', () => {
    renderWithProviders(<App />);
    const interactiveElements = screen.getAllByRole('button');
    interactiveElements.forEach(element => {
      expect(element).toHaveFocus();
      userEvent.tab();
    });
  });

  test('ARIA attributes are correctly applied', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'Excel Spreadsheet');
    expect(screen.getByTestId('formula-bar')).toHaveAttribute('aria-label', 'Formula Bar');
  });
});

describe('Performance Tests', () => {
  test('renders large datasets efficiently', async () => {
    const largeMockWorkbook = {
      sheets: [{
        name: 'LargeSheet',
        cells: Object.fromEntries(
          Array.from({ length: 1000 }, (_, i) => [`A${i + 1}`, { value: `Value ${i + 1}` }])
        )
      }]
    };
    (api.fetchInitialData as jest.Mock).mockResolvedValue(largeMockWorkbook);
    
    const startTime = performance.now();
    renderWithProviders(<App />);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(1000); // Render should take less than 1 second
    
    await waitFor(() => {
      expect(screen.getAllByRole('gridcell').length).toBe(1000);
    });
  });

  test('handles frequent updates without significant performance degradation', async () => {
    renderWithProviders(<App />);
    const cell = screen.getByTestId('cell-A1');
    const formulaBar = screen.getByTestId('formula-bar-input');
    
    const updateCount = 100;
    const startTime = performance.now();
    
    for (let i = 0; i < updateCount; i++) {
      userEvent.clear(formulaBar);
      userEvent.type(formulaBar, `=SUM(1,${i})`);
      userEvent.keyboard('{Enter}');
    }
    
    const endTime = performance.now();
    const averageUpdateTime = (endTime - startTime) / updateCount;
    
    expect(averageUpdateTime).toBeLessThan(10); // Each update should take less than 10ms on average
    
    await waitFor(() => {
      expect(cell).toHaveTextContent(`${updateCount}`);
    });
  });
});

describe('Integration Tests', () => {
  test('correctly fetches and displays data from mock API', async () => {
    const mockData = {
      sheets: [{
        name: 'TestSheet',
        cells: {
          'A1': { value: 'Hello' },
          'B1': { value: 'World' }
        }
      }]
    };
    (api.fetchInitialData as jest.Mock).mockResolvedValue(mockData);
    
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('TestSheet')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('World')).toBeInTheDocument();
    });
  });

  test('handles authentication flows properly', async () => {
    (auth.isAuthenticated as jest.Mock).mockReturnValue(false);
    (auth.login as jest.Mock).mockResolvedValue({ name: 'Jane Doe' });
    
    renderWithProviders(<App />);
    
    const loginButton = screen.getByTestId('login-button');
    userEvent.click(loginButton);
    
    await waitFor(() => {
      expect(auth.login).toHaveBeenCalled();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  test('integrates with mock external data sources', async () => {
    const mockExternalData = { 'C1': { value: 'External Data' } };
    (api.fetchExternalData as jest.Mock).mockResolvedValue(mockExternalData);
    
    renderWithProviders(<App />);
    
    const importButton = screen.getByTestId('import-external-data');
    userEvent.click(importButton);
    
    await waitFor(() => {
      expect(screen.getByText('External Data')).toBeInTheDocument();
    });
  });
});