import { CoreEngine } from '../../core-engine/CoreEngine';
import { testHelpers } from '../utils/test-helpers';
import { mockDataGenerator } from '../utils/mock-data-generator';
import { jest } from '@jest/globals';

describe('CoreEngine', () => {
  let coreEngine: CoreEngine;

  beforeEach(() => {
    // Set up the testing environment before each test case
    coreEngine = new CoreEngine();
  });

  afterEach(() => {
    // Clean up the testing environment after each test case
    jest.clearAllMocks();
  });

  test('should initialize a new workbook', () => {
    const workbook = coreEngine.initializeWorkbook();
    expect(workbook).toBeDefined();
    expect(workbook.sheets.length).toBeGreaterThan(0);
    expect(workbook.name).toBeDefined();
  });

  test('should load an existing workbook', () => {
    const mockWorkbookData = mockDataGenerator.generateWorkbookData();
    const loadedWorkbook = coreEngine.loadWorkbook(mockWorkbookData);
    expect(loadedWorkbook).toBeDefined();
    expect(loadedWorkbook.name).toBe(mockWorkbookData.name);
    expect(loadedWorkbook.sheets.length).toBe(mockWorkbookData.sheets.length);
  });

  test('should save a workbook', () => {
    const workbook = coreEngine.initializeWorkbook();
    const savedFile = coreEngine.saveWorkbook(workbook);
    expect(savedFile).toBeDefined();
    expect(savedFile.name).toMatch(/\.xlsx$/);
  });

  test('should perform calculations', () => {
    const mockData = mockDataGenerator.generateTestData();
    const result = coreEngine.performCalculation(mockData);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  test('should update cell values', () => {
    const workbook = coreEngine.initializeWorkbook();
    const sheet = workbook.sheets[0];
    const updatedCell = coreEngine.updateCellValue(sheet, 'A1', '42');
    expect(updatedCell.value).toBe('42');
  });

  test('should generate charts', () => {
    const mockChartData = mockDataGenerator.generateChartData();
    const chart = coreEngine.generateChart(mockChartData);
    expect(chart).toBeDefined();
    expect(chart.type).toBe(mockChartData.type);
    expect(chart.data).toEqual(mockChartData.data);
  });

  test('should perform data analysis', () => {
    const mockAnalysisData = mockDataGenerator.generateAnalysisData();
    const analysisResult = coreEngine.performDataAnalysis(mockAnalysisData);
    expect(analysisResult).toBeDefined();
    expect(analysisResult.summary).toBeDefined();
  });

  test('should handle large datasets efficiently', () => {
    const largeDataset = mockDataGenerator.generateLargeDataset();
    const startTime = Date.now();
    const result = coreEngine.processLargeDataset(largeDataset);
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    expect(result).toBeDefined();
    expect(processingTime).toBeLessThan(5000); // Assuming 5 seconds is our performance threshold
  });

  test('should integrate with external data sources', () => {
    const mockExternalData = mockDataGenerator.generateExternalData();
    const integratedData = coreEngine.integrateExternalData(mockExternalData);
    expect(integratedData).toBeDefined();
    expect(integratedData.length).toBeGreaterThan(0);
    expect(integratedData[0].source).toBe('external');
  });
});