import { setup, teardown } from '../setup';
import { testHelpers } from '../utils/test-helpers';
import { generateMockData } from '../utils/mock-data-generator';
import { CoreEngine } from '../../core-engine/CoreEngine';
import { CalculationEngine } from '../../calculation-engine/CalculationEngine';
import { DataAnalysisEngine } from '../../data-analysis-engine/DataAnalysisEngine';
import { ChartingEngine } from '../../charting-engine';
import { api } from '../../backend-api/app';
import supertest from 'supertest';

const request = supertest(api);

describe('Data Flow Integration Tests', () => {
  let coreEngine: CoreEngine;
  let calculationEngine: CalculationEngine;
  let dataAnalysisEngine: DataAnalysisEngine;
  let chartingEngine: ChartingEngine;

  beforeAll(async () => {
    await setup();
    coreEngine = new CoreEngine();
    calculationEngine = new CalculationEngine();
    dataAnalysisEngine = new DataAnalysisEngine();
    chartingEngine = new ChartingEngine();
  });

  afterAll(async () => {
    await teardown();
  });

  test('Data input to storage flow', async () => {
    const mockData = generateMockData.worksheet();
    const response = await request.post('/api/worksheets').send(mockData);
    expect(response.status).toBe(201);
    
    const storedData = await coreEngine.getWorksheet(response.body.id);
    expect(storedData).toEqual(mockData);
  });

  test('Calculation engine data processing', async () => {
    const mockFormula = '=SUM(A1:A10)';
    const mockRange = generateMockData.range(10);
    
    const result = await calculationEngine.processFormula(mockFormula, mockRange);
    expect(result).toBe(mockRange.reduce((sum, val) => sum + val, 0));
  });

  test('Data analysis engine processing', async () => {
    const mockDataset = generateMockData.dataset();
    const analysisType = 'descriptiveStatistics';
    
    const result = await dataAnalysisEngine.performAnalysis(analysisType, mockDataset);
    expect(result).toHaveProperty('mean');
    expect(result).toHaveProperty('median');
    expect(result).toHaveProperty('standardDeviation');
  });

  test('Charting engine data visualization', async () => {
    const mockChartData = generateMockData.chartData();
    const chartType = 'barChart';
    
    const chart = await chartingEngine.createChart(chartType, mockChartData);
    expect(chart).toHaveProperty('type', chartType);
    expect(chart).toHaveProperty('data');
    expect(chart).toHaveProperty('options');
  });

  test('External data source integration', async () => {
    const externalDataSourceUrl = 'https://api.example.com/data';
    const mockExternalData = generateMockData.externalData();
    
    // Mock the external API call
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockExternalData),
      ok: true,
    } as any);

    const importedData = await coreEngine.importExternalData(externalDataSourceUrl);
    expect(importedData).toEqual(mockExternalData);
    
    // Clean up the mock
    (global.fetch as jest.Mock).mockRestore();
  });

  test('Large dataset performance', async () => {
    const largeDataset = generateMockData.largeDataset(1000000); // 1 million rows
    
    const startTime = Date.now();
    await coreEngine.processLargeDataset(largeDataset);
    const endTime = Date.now();
    
    const processingTime = endTime - startTime;
    expect(processingTime).toBeLessThan(5000); // Assuming 5 seconds is the performance threshold
  });
});