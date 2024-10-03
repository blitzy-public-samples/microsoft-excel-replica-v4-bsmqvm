import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import * as testHelpers from '../utils/test-helpers';
import * as mockDataGenerator from '../utils/mock-data-generator';
import { AppConstants } from '../shared/constants/AppConstants';
import { ErrorHandlingUtils } from '../shared/utils/ErrorHandlingUtils';

// Declare global variable for React testing
declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

/**
 * Sets up the global test environment for all test suites.
 */
export function setupTestEnvironment(): void {
  // Configure Jest environment
  jest.setTimeout(30000); // Set global timeout to 30 seconds

  // Set up JSDOM for browser-like context
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
  });
  global.document = dom.window.document;
  global.window = dom.window as unknown as Window & typeof globalThis;

  // Mock global objects and functions
  mockGlobalObjects();

  // Import and configure utility functions
  configureTestHelpers();

  // Set up error handling and logging configurations
  setupErrorHandling();

  // Configure polyfills for cross-platform testing
  setupPolyfills();

  // Initialize global state for Excel-specific functionality
  initializeExcelGlobalState();

  // Set up mock implementations for external services
  setupExternalServiceMocks();

  // Set IS_REACT_ACT_ENVIRONMENT for React testing
  global.IS_REACT_ACT_ENVIRONMENT = true;
}

/**
 * Mocks console.error to prevent unwanted error outputs during tests.
 */
export function mockConsoleErrors(): void {
  const originalConsoleError = console.error;
  console.error = jest.fn();

  // Restore original console.error after tests
  afterAll(() => {
    console.error = originalConsoleError;
  });
}

/**
 * Sets up global mocks for external dependencies or browser APIs.
 */
export function setupGlobalMocks(): void {
  // Mock window object properties and methods
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock document object properties and methods
  document.createRange = () => ({
    setStart: jest.fn(),
    setEnd: jest.fn(),
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  } as unknown as Range);

  // Set up mocks for other global APIs (e.g., localStorage, fetch)
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
    })
  ) as jest.Mock;

  // Configure mocks for Excel-specific global functions or objects
  global.Excel = {
    run: jest.fn(),
    // Add other Excel-specific global functions as needed
  };
}

function mockGlobalObjects(): void {
  global.alert = jest.fn();
  global.confirm = jest.fn();
  global.prompt = jest.fn();
}

function configureTestHelpers(): void {
  // Assuming testHelpers has a setup function
  testHelpers.setup();
}

function setupErrorHandling(): void {
  ErrorHandlingUtils.initialize({
    logErrors: true,
    errorCallback: (error: Error) => {
      console.error('Test Error:', error);
    },
  });
}

function setupPolyfills(): void {
  // Add any necessary polyfills for cross-platform testing
  if (!global.TextEncoder) {
    global.TextEncoder = require('util').TextEncoder;
  }
  if (!global.TextDecoder) {
    global.TextDecoder = require('util').TextDecoder;
  }
}

function initializeExcelGlobalState(): void {
  global.ExcelState = {
    currentWorkbook: null,
    currentWorksheet: null,
    // Add other global state properties as needed
  };
}

function setupExternalServiceMocks(): void {
  // Mock external services like API calls
  jest.mock('../services/api', () => ({
    fetchData: jest.fn(() => Promise.resolve([])),
    saveData: jest.fn(() => Promise.resolve({ success: true })),
  }));
}

// Run the setup
setupTestEnvironment();
mockConsoleErrors();
setupGlobalMocks();