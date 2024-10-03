import { DataAnalysisEngine } from '../../data-analysis-engine/DataAnalysisEngine';
import { testHelpers } from '../utils/test-helpers';
import { mockDataGenerator } from '../utils/mock-data-generator';
import { expect } from 'jest';

describe('Data Analysis Engine', () => {
  let dataAnalysisEngine: DataAnalysisEngine;

  beforeEach(() => {
    dataAnalysisEngine = new DataAnalysisEngine();
  });

  afterEach(() => {
    // Clean up any resources or mocks created during tests
    jest.clearAllMocks();
  });

  test('SortData function should correctly sort data in ascending and descending order', () => {
    const mockData = mockDataGenerator.generateNumericData(100);
    
    const ascendingResult = dataAnalysisEngine.SortData(mockData, 'ascending');
    expect(ascendingResult).toBeSorted();

    const descendingResult = dataAnalysisEngine.SortData(mockData, 'descending');
    expect(descendingResult).toBeSorted({ descending: true });

    // Check performance metrics
    const sortPerformance = testHelpers.measurePerformance(() => {
      dataAnalysisEngine.SortData(mockData, 'ascending');
    });
    expect(sortPerformance).toBeLessThan(100); // Assuming 100ms is an acceptable threshold
  });

  test('FilterData function should correctly filter data based on threshold', () => {
    const mockData = mockDataGenerator.generateNumericData(1000);
    const threshold = 50;

    const filteredData = dataAnalysisEngine.FilterData(mockData, threshold);
    
    expect(filteredData.every(value => value >= threshold)).toBe(true);
    expect(filteredData.length).toBeLessThan(mockData.length);

    // Test edge cases
    expect(dataAnalysisEngine.FilterData(mockData, -Infinity)).toEqual(mockData);
    expect(dataAnalysisEngine.FilterData(mockData, Infinity)).toHaveLength(0);
  });

  test('GeneratePivotTable function should correctly generate a pivot table', () => {
    const mockData = mockDataGenerator.generatePivotTableData(1000);
    
    const pivotTable = dataAnalysisEngine.GeneratePivotTable(mockData, 'category', 'value', 'sum');
    
    expect(pivotTable).toHaveProperty('rows');
    expect(pivotTable).toHaveProperty('columns');
    expect(pivotTable).toHaveProperty('values');

    // Verify the structure and calculations in the pivot table
    const categories = [...new Set(mockData.map(item => item.category))];
    expect(pivotTable.rows).toEqual(expect.arrayContaining(categories));

    // Check if the sum is correct for each category
    categories.forEach(category => {
      const sum = mockData
        .filter(item => item.category === category)
        .reduce((acc, item) => acc + item.value, 0);
      expect(pivotTable.values[category]).toBeCloseTo(sum);
    });
  });

  test('PerformStatisticalAnalysis function should return correct statistical measures', () => {
    const mockData = mockDataGenerator.generateNumericData(1000);
    
    const stats = dataAnalysisEngine.PerformStatisticalAnalysis(mockData);
    
    expect(stats).toHaveProperty('mean');
    expect(stats).toHaveProperty('median');
    expect(stats).toHaveProperty('standardDeviation');
    expect(stats).toHaveProperty('min');
    expect(stats).toHaveProperty('max');

    // Verify accuracy of calculations
    const sum = mockData.reduce((acc, val) => acc + val, 0);
    const mean = sum / mockData.length;
    expect(stats.mean).toBeCloseTo(mean);

    const sortedData = [...mockData].sort((a, b) => a - b);
    const median = sortedData[Math.floor(sortedData.length / 2)];
    expect(stats.median).toBeCloseTo(median);

    expect(stats.min).toBe(Math.min(...mockData));
    expect(stats.max).toBe(Math.max(...mockData));
  });

  test('ForecastTimeSeries function should generate accurate forecasts', () => {
    const mockTimeSeries = mockDataGenerator.generateTimeSeriesData(100);
    const forecastPeriods = 10;

    const forecast = dataAnalysisEngine.ForecastTimeSeries(mockTimeSeries, forecastPeriods);

    expect(forecast).toHaveLength(forecastPeriods);
    expect(forecast[0]).toBeGreaterThan(0); // Assuming non-negative values

    // Test different forecasting periods
    const shortForecast = dataAnalysisEngine.ForecastTimeSeries(mockTimeSeries, 5);
    expect(shortForecast).toHaveLength(5);

    const longForecast = dataAnalysisEngine.ForecastTimeSeries(mockTimeSeries, 20);
    expect(longForecast).toHaveLength(20);

    // Test with different data patterns
    const trendingUpData = mockDataGenerator.generateTrendingTimeSeriesData(100, 'up');
    const trendingUpForecast = dataAnalysisEngine.ForecastTimeSeries(trendingUpData, forecastPeriods);
    expect(trendingUpForecast[forecastPeriods - 1]).toBeGreaterThan(trendingUpForecast[0]);

    const trendingDownData = mockDataGenerator.generateTrendingTimeSeriesData(100, 'down');
    const trendingDownForecast = dataAnalysisEngine.ForecastTimeSeries(trendingDownData, forecastPeriods);
    expect(trendingDownForecast[forecastPeriods - 1]).toBeLessThan(trendingDownForecast[0]);
  });
});